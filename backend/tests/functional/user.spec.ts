import { test } from '@japa/runner'
import { UserRole } from '#models/user'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('Users Controller', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('register creates a new user', async ({ client, assert }) => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    const response = await client.post('/api/register').json(userData)

    response.assertStatus(201)
    const responseBody = response.body()

    assert.equal(responseBody.firstName, userData.firstName)
    assert.equal(responseBody.lastName, userData.lastName)
    assert.equal(responseBody.email, userData.email)
    assert.equal(responseBody.role, UserRole.EMPLOYEE)
    assert.notExists(responseBody.password)

    const user = await User.findBy('email', userData.email)
    assert.exists(user)
  })

  test('register validates unique email', async ({ client }) => {
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const response = await client.post('/api/register').json({
      firstName: 'Another',
      lastName: 'User',
      email: 'john@example.com',
      password: 'password123',
    })

    response.assertStatus(422)
  })

  test('login succeeds with valid credentials', async ({ client, assert }) => {
    const password = 'password123'
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await hash.make(password),
      role: UserRole.EMPLOYEE,
    })

    const response = await client.post('/api/login').json({
      email: user.email,
      password: password,
    })

    response.assertStatus(200)
    const responseBody = response.body()
    assert.exists(responseBody.token)
    assert.equal(responseBody.user.email, user.email)
  })

  test('login fails with invalid credentials', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    })

    response.assertStatus(401)
  })

  test('profile returns authenticated user data', async ({ client, assert }) => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/profile').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    const profile = response.body()
    assert.equal(profile.email, user.email)
    assert.equal(profile.fullName, `${user.firstName} ${user.lastName}`)
  })

  test('updateProfile modifies user data', async ({ client, assert }) => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    }

    const response = await client
      .put('/api/profile')
      .header('Authorization', `Bearer ${token}`)
      .json(updateData)

    response.assertStatus(200)
    const updatedProfile = response.body()
    assert.equal(updatedProfile.firstName, updateData.firstName)
    assert.equal(updatedProfile.lastName, updateData.lastName)
    assert.equal(updatedProfile.email, updateData.email)
  })

  test('changePassword updates user password', async ({ client, assert }) => {
    const originalPassword = 'password123'
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await hash.make(originalPassword),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: user.email,
      password: originalPassword,
    })
    const token = loginResponse.body().token

    const newPassword = 'newpassword123'
    const response = await client
      .put('/api/change-password')
      .header('Authorization', `Bearer ${token}`)
      .json({
        currentPassword: originalPassword,
        newPassword: newPassword,
        confirmPassword: newPassword,
      })

    response.assertStatus(200)

    const newLoginResponse = await client.post('/api/login').json({
      email: user.email,
      password: newPassword,
    })

    newLoginResponse.assertStatus(200)
  })

  test('admin can list all users', async ({ client, assert }) => {
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await hash.make('password123'),
      role: UserRole.ADMIN,
    })

    await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: admin.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/users').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    const users = response.body()
    assert.equal(users.length, 2)
  })

  test('non-admin cannot list users', async ({ client }) => {
    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/users').header('Authorization', `Bearer ${token}`)

    response.assertStatus(403)
  })

  test('admin can update user role', async ({ client, assert }) => {
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await hash.make('password123'),
      role: UserRole.ADMIN,
    })

    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: admin.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const response = await client
      .put(`/api/users/${user.id}/role`)
      .header('Authorization', `Bearer ${token}`)
      .json({ role: UserRole.MANAGER })

    response.assertStatus(200)
    const updatedUser = response.body()
    assert.equal(updatedUser.role, UserRole.MANAGER)
  })

  test('admin can delete user', async ({ client, assert }) => {
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await hash.make('password123'),
      role: UserRole.ADMIN,
    })

    const userToDelete = await User.create({
      firstName: 'Delete',
      lastName: 'Me',
      email: 'delete@example.com',
      password: await hash.make('password123'),
      role: UserRole.EMPLOYEE,
    })

    const loginResponse = await client.post('/api/login').json({
      email: admin.email,
      password: 'password123',
    })
    const token = loginResponse.body().token

    const response = await client
      .delete(`/api/users/${userToDelete.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)

    const deletedUser = await User.find(userToDelete.id)
    assert.notExists(deletedUser)
  })
})
