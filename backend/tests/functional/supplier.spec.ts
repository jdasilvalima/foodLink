import { test } from '@japa/runner'
import Supplier from '#models/supplier'

test.group('Suppliers Controller', (group) => {
  group.each.setup(async () => {
    await Supplier.query().delete()
  })

  test('index returns all suppliers', async ({ client, assert }) => {
    const testSuppliers = await Supplier.createMany([
      {
        name: 'Global Foods Inc.',
        email: 'contact@globalfoods.com',
        phoneNumber: '+1-555-123-4567',
      },
      {
        name: 'Premium Packaging',
        email: 'sales@premiumpack.com',
        phoneNumber: '+1-555-234-5678',
      },
    ])

    const response = await client.get('/api/suppliers')

    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.length, 2)

    const sortedTestSuppliers = testSuppliers.sort((a, b) => a.name.localeCompare(b.name))
    const sortedResponseSuppliers = responseBody.sort((a, b) => a.name.localeCompare(b.name))
    sortedTestSuppliers.forEach((testSupplier, index) => {
      assert.equal(sortedResponseSuppliers[index].name, testSupplier.name)
      assert.equal(sortedResponseSuppliers[index].email, testSupplier.email)
      assert.equal(sortedResponseSuppliers[index].phoneNumber, testSupplier.phoneNumber)
    })
  })

  test('show returns specific supplier', async ({ client, assert }) => {
    const supplier = await Supplier.create({
      name: 'Test Supplier',
      email: 'test@supplier.com',
      phoneNumber: '+1-555-123-4567',
    })

    const response = await client.get(`/api/suppliers/${supplier.id}`)

    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.name, supplier.name)
    assert.equal(responseBody.email, supplier.email)
    assert.equal(responseBody.phoneNumber, supplier.phoneNumber)
  })

  test('show returns 404 for non-existent supplier', async ({ client }) => {
    const response = await client.get('/api/suppliers/999')
    response.assertStatus(404)
  })

  test('store creates new supplier', async ({ client, assert }) => {
    const testData = {
      name: 'New Supplier',
      email: 'new@supplier.com',
      phoneNumber: '+1-555-123-4567',
    }

    const response = await client.post('/api/suppliers').json(testData)

    response.assertStatus(201)
    const responseBody = response.body()
    assert.equal(responseBody.name, testData.name)
    assert.equal(responseBody.email, testData.email)
    assert.equal(responseBody.phoneNumber, testData.phoneNumber)

    const supplier = await Supplier.findBy('email', testData.email)
    assert.exists(supplier)
  })

  test('store validates input data', async ({ client }) => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      phoneNumber: '123',
    }

    const response = await client.post('/api/suppliers').json(invalidData)

    response.assertStatus(422)
  })

  test('update modifies existing supplier', async ({ client, assert }) => {
    const supplier = await Supplier.create({
      name: 'Original Name',
      email: 'original@supplier.com',
      phoneNumber: '+1-555-123-4567',
    })

    const updateData = {
      name: 'Updated Name',
      email: 'updated@supplier.com',
      phoneNumber: '+1-555-987-6543',
    }

    const response = await client.put(`/api/suppliers/${supplier.id}`).json(updateData)

    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.name, updateData.name)
    assert.equal(responseBody.email, updateData.email)
    assert.equal(responseBody.phoneNumber, updateData.phoneNumber)

    await supplier.refresh()
    assert.equal(supplier.name, updateData.name)
    assert.equal(supplier.email, updateData.email)
    assert.equal(supplier.phoneNumber, updateData.phoneNumber)
  })

  test('update returns 404 for non-existent supplier', async ({ client }) => {
    const updateData = {
      name: 'Updated Name',
      email: 'updated@supplier.com',
      phoneNumber: '+1-555-987-6543',
    }

    const response = await client.put('/api/suppliers/999').json(updateData)
    response.assertStatus(404)
  })

  test('destroy removes supplier', async ({ client, assert }) => {
    const supplier = await Supplier.create({
      name: 'To Delete',
      email: 'delete@supplier.com',
      phoneNumber: '+1-555-123-4567',
    })

    const response = await client.delete(`/api/suppliers/${supplier.id}`)

    response.assertStatus(204)

    const deletedSupplier = await Supplier.find(supplier.id)
    assert.notExists(deletedSupplier)
  })

  test('destroy returns 404 for non-existent supplier', async ({ client }) => {
    const response = await client.delete('/api/suppliers/999')
    response.assertStatus(404)
  })

  test('store validates unique email constraint', async ({ client, assert }) => {
    await Supplier.create({
      name: 'First Supplier',
      email: 'test@supplier.com',
      phoneNumber: '+1-555-123-4567',
    })

    const response = await client.post('/api/suppliers').json({
      name: 'Second Supplier',
      email: 'test@supplier.com',
      phoneNumber: '+1-555-987-6543',
    })

    response.assertStatus(422)
    const responseBody = response.body()
    assert.exists(responseBody.errors)
  })
})
