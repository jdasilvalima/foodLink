// app/validators/user.ts
import vine from '@vinejs/vine'
import { UserRole } from '#models/user'

export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
    role: vine.enum(Object.values(UserRole)),
  })
)
