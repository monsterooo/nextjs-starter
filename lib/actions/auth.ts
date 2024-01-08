"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import type * as z from "zod";
import {
  forgetSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { signIn } from "../auth";
import { db } from "../db";
import { SendResetEmail, SendVerifyEmail } from "../email";
import { isProd } from "../utils";

const domain = process.env.NEXT_PUBLIC_APP_URL;

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
  const confirmLink = `${domain}/email-verification?token=${verificationToken.token}`;

  if (isProd()) {
    // send verify email
    try {
      await SendVerifyEmail({
        email,
        title: "Confirm your email.",
        link: confirmLink,
      });
    } catch (error) {
      return {
        error:
          "Failed to send the confirmation email, Re-log in to send again.",
      };
    }
  } else {
    console.log("verify url:", confirmLink);
  }

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

  // re-verify email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    const confirmLink = `${domain}/email-verification?token=${verificationToken.token}`;

    if (isProd()) {
      // send verify email
      try {
        await SendVerifyEmail({
          email,
          title: "Confirm your email.",
          link: confirmLink,
        });
      } catch (error) {
        return {
          error:
            "Failed to send the confirmation email, Re-log in to send again.",
        };
      }
    } else {
      console.log("verify url:", confirmLink);
    }

    return { success: "Confirmation email sent!" };
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

export async function emailVerification(token: string) {
  const existingToken = await db.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingUser.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified!" };
}

export async function forgetPassword(values: z.infer<typeof forgetSchema>) {
  const validatedFields = forgetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordToken(email);
  const resetLink = `${domain}/reset-password?token=${passwordResetToken.token}`;

  if (isProd()) {
    try {
      await SendResetEmail({
        email: "createthink.net@gmail.com", // passwordResetToken.email,
        title: "Reset your password.",
        link: resetLink,
      });
    } catch (error) {
      console.error(error);
      return { error: "Sending email failed, please try again later!" };
    }
  } else {
    console.log("reset url:", resetLink);
  }

  return { success: "Reset email sent!" };
}

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>,
  token?: string | null
) {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = resetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;
  const existingToken = await db.passwordResetToken.findUnique({
    where: {
      token,
    },
  });

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated!" };
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

async function generatePasswordToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await db.passwordResetToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}
