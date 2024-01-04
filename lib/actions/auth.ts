"use server";

import bcryptjs from "bcryptjs";
import type * as z from "zod";

import { loginSchema, registerSchema } from "@/lib/validations/auth";

import { signIn } from "../auth";
import { db } from "../db";

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

  return { success: "Account creation succeeded" };
}

export async function login(values: z.infer<typeof loginSchema>) {
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
      redirectTo: "/",
    });
  } catch (error) {
    console.log("登录错误：", error);
    throw error;
  }
}
