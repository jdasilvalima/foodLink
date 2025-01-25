import { test } from '@japa/runner'
import Supply from '#models/supply'
import { createSupplyValidator } from '#validators/supply'

test.group('SuppliesController', (group) => {
  group.each.setup(async () => {
    await Supply.query().delete()
  })

  test('index returns all supplies', async ({ client }) => {
    const testSupplies = await Supply.createMany([
      {
        number: 'RM001',
        name: 'Test Supply 1',
        unitType: 'cs',
        unitsPerPackage: 10,
        type: 'raw',
      },
      {
        number: 'RM002',
        name: 'Test Supply 2',
        unitType: 'bag',
        unitsPerPackage: 20,
        type: 'raw',
      },
    ])

    const response = await client.get('/api/supplies')

    response.assertStatus(200)

    response.assertBodyContains(
      testSupplies.map((supply) => ({
        number: supply.number,
        name: supply.name,
        unitType: supply.unitType,
        unitsPerPackage: supply.unitsPerPackage,
        type: supply.type,
      }))
    )
  })

  test('show returns specific supply', async ({ client }) => {
    const supply = await Supply.create({
      number: 'RM001',
      name: 'Test Supply',
      unitType: 'cs',
      unitsPerPackage: 10,
      type: 'raw',
    })

    const response = await client.get(`/api/supplies/${supply.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: supply.id,
      name: supply.name,
      number: supply.number,
      type: supply.type,
    })
  })

  test('show returns 404 for non-existent supply', async ({ client }) => {
    const response = await client.get('/api/supplies/999')
    response.assertStatus(404)
  })

  test('store creates new supply', async ({ client, assert }) => {
    const testData = {
      number: 'RM003',
      name: 'New Supply',
      unitType: 'bag',
      unitsPerPackage: 30,
      type: 'raw',
    }

    const response = await client.post('/api/supplies').json(testData)

    response.assertStatus(201)
    response.assertBodyContains(testData)

    const supply = await Supply.findBy('number', testData.number)
    assert.exists(supply)
  })

  test('store validates input data', async ({ client }) => {
    const invalidData = {
      number: '',
      name: 'Test',
      unitType: 'cs',
      unitsPerPackage: -1,
      type: 'raw',
    }

    const response = await client.post('/api/supplies').json(invalidData)

    response.assertStatus(422)
  })

  test('update modifies existing supply', async ({ client, assert }) => {
    const supply = await Supply.create({
      number: 'RM001',
      name: 'Original Name',
      unitType: 'cs',
      unitsPerPackage: 10,
      type: 'raw',
    })

    const updateData = {
      number: 'RM001',
      name: 'Updated Name',
      unitType: 'cs',
      unitsPerPackage: 15,
      type: 'raw',
    }

    const response = await client.put(`/api/supplies/${supply.id}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains(updateData)

    await supply.refresh()
    assert.equal(supply.name, updateData.name)
    assert.equal(supply.unitsPerPackage, updateData.unitsPerPackage)
  })

  test('update returns 404 for non-existent supply', async ({ client }) => {
    const updateData = {
      number: 'RM001',
      name: 'Test Supply',
      unitType: 'cs',
      unitsPerPackage: 10,
      type: 'raw',
    }

    const response = await client.put('/api/supplies/999').json(updateData)
    response.assertStatus(404)
  })

  test('destroy removes supply', async ({ client, assert }) => {
    const supply = await Supply.create({
      number: 'RM001',
      name: 'Test Supply',
      unitType: 'cs',
      unitsPerPackage: 10,
      type: 'raw',
    })

    const response = await client.delete(`/api/supplies/${supply.id}`)

    response.assertStatus(204)

    const deletedSupply = await Supply.find(supply.id)
    assert.notExists(deletedSupply)
  })

  test('destroy returns 404 for non-existent supply', async ({ client }) => {
    const response = await client.delete('/api/supplies/999')
    response.assertStatus(404)
  })

  test('store validates unique number constraint', async ({ client }) => {
    await Supply.create({
      number: 'RM001',
      name: 'Test Supply',
      unitType: 'cs',
      unitsPerPackage: 10,
      type: 'raw',
    })

    // Act: Try to create another supply with same number
    const response = await client.post('/api/supplies').json({
      number: 'RM001',
      name: 'Another Supply',
      unitType: 'bag',
      unitsPerPackage: 20,
      type: 'raw',
    })

    response.assertStatus(422)
  })
})
