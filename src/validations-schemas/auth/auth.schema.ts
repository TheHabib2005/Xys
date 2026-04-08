import { z } from 'zod'


export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  name: z.string().min(1, 'Fullname Must Be Requried'),
  acceptTerms: z.boolean({message:"Please Select acceptTerms"}),
  role: z.enum(["MANAGER", "USER"], {
  required_error: "Please select a role",
}),
})

export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterSchema>
