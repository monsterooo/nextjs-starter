import * as z from "zod";

const name = z.string().min(1).max(32);
const email = z.string().email({
  message: "Email is required",
});
const password = z.string().min(6, {
  message: "Minimum 6 characters required",
});

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export const registerSchema = z.object({
  name,
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password,
});

export const forgetSchema = z.object({
  email,
});

export const resetPasswordSchema = z.object({
  password,
});
