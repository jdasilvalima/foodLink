import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import User, { UserRole } from '#models/user'
import {
  createUserValidator,
  updateProfileValidator,
  loginValidator,
  changePasswordValidator,
  updateRoleValidator,
} from '#validators/user'

@inject()
export default class UsersController {
  /**
   * Get all users (admin only)
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!user.isAdmin()) {
      return response.forbidden({ message: 'Access denied' })
    }

    const users = await User.all()
    return response.json(users)
  }

  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    const hashedPassword = await hash.make(data.password)
    const user = await User.create({
      ...data,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    })

    return response.created({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  }

  /**
   * Login user
   */
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days',
      })

      const user = auth.user!
      return response.json({
        token: token.value,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      })
    } catch {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  /**
   * Get current user profile
   */
  async profile({ auth, response }: HttpContext) {
    const user = auth.user!
    return response.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    })
  }

  /**
   * Update user profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(updateProfileValidator(user.id))

    user.merge(data)
    await user.save()

    return response.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  }

  /**
   * Change password
   */
  async changePassword({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)

    // Verify current password
    const isValid = await hash.verify(user.password, currentPassword)
    if (!isValid) {
      return response.badRequest({ message: 'Current password is incorrect' })
    }

    // Update password
    user.password = await hash.make(newPassword)
    await user.save()

    return response.json({ message: 'Password updated successfully' })
  }

  /**
   * Update user role (admin only)
   */
  async updateRole({ auth, params, request, response }: HttpContext) {
    const adminUser = auth.user!
    if (!adminUser.isAdmin()) {
      return response.forbidden({ message: 'Access denied' })
    }

    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const { role } = await request.validateUsing(updateRoleValidator)
    user.role = role
    await user.save()

    return response.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  }

  /**
   * Delete user (admin only)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const adminUser = auth.user!
    if (!adminUser.isAdmin()) {
      return response.forbidden({ message: 'Access denied' })
    }

    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    // Prevent self-deletion
    if (user.id === adminUser.id) {
      return response.badRequest({ message: 'Cannot delete your own account' })
    }

    await user.delete()
    return response.noContent()
  }
}
