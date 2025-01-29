// database/seeders/user.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { UserRole } from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        firstName: 'UserAdmin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      },
      {
        firstName: 'UserManager',
        lastName: 'User',
        email: 'manager@example.com',
        password: 'password123',
        role: UserRole.MANAGER,
      },
      {
        firstName: 'UserEmployee',
        lastName: 'User',
        email: 'employee@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE,
      },
    ])
  }
}
