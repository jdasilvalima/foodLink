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

export const updateProfileValidator = (userId: number) =>
  vine.compile(
    vine.object({
      firstName: vine.string().trim().minLength(2).maxLength(50),
      lastName: vine.string().trim().minLength(2).maxLength(50),
      email: vine
        .string()
        .email()
        .unique({
          table: 'users',
          column: 'email',
          whereNot: { id: userId },
        }),
    })
  )

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine.string().minLength(8),
    confirmPassword: vine.string().confirmed({ confirmWith: 'newPassword' }),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    role: vine.enum(Object.values(UserRole)),
  })
)
