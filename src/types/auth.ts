import { z } from "zod"

// Login schema
export const loginSchema = z.object({
  email: z.string().email({
    message: "The scroll must contain a valid email rune.",
  }),
  password: z.string().min(8, {
    message: "Your magical password must be at least 8 characters long.",
  }),
  rememberMe: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>

// Signup schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Your chosen name must be at least 3 characters long.",
    })
    .max(20, {
      message: "Your chosen name cannot exceed 20 characters.",
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Your name can only contain letters, numbers, underscores, and dashes.",
    }),
  email: z.string().email({
    message: "The scroll must contain a valid email rune.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Your magical password must be at least 8 characters long.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message:
        "Your password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms of the realm to proceed.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "The magical passwords do not match.",
  path: ["confirmPassword"],
})

export type SignupInput = z.infer<typeof signupSchema>

// User type
export interface User {
  id: string
  username: string
  email: string
  gameProgress?: {
    level: number
    experience: number
    achievements: string[]
  }
  settings?: {
    theme: "light" | "dark"
    notifications: boolean
    sound: boolean
  }
}

// Authentication response
export interface AuthResponse {
  user: User
  token?: string
  message?: string
}

// Error response
export interface ErrorResponse {
  error: string
  message?: string
  validationErrors?: Record<string, string>
}