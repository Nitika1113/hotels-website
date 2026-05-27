import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Minimum 8 characters"),

  terms: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 8 characters"),

  terms: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please check the checkbox to continue",
    }),
});