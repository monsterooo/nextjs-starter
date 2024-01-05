"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import type * as z from "zod";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { signIn } from "../auth";
import { db } from "../db";
import { sendVerificationEmail } from "../mail";

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashPassword = await bcryptjs.hash(password, 10);
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
    },
  });

  // send email verification token
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail();

  return { success: "Confirmation email sent!" };
}

export async function login(
  values: z.infer<typeof loginSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}

async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await db.verificationToken.findFirst({
    where: {
      email,
    },
  });
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
}
