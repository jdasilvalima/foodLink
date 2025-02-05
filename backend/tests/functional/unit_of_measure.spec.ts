import { test } from '@japa/runner'
import UnitOfMeasure from '#models/unit_of_measure'

test.group('Unit of Measures Controller', (group) => {
  group.each.setup(async () => {
    await UnitOfMeasure.query().delete()
  })

  test('index returns all units of measure', async ({ client, assert }) => {
    // Arrange
    const testUnits = await UnitOfMeasure.createMany([
      {
        unit: 'kg',
        description: 'Kilograms',
        isActive: true,
      },
      {
        unit: 'lbs',
        description: 'Pounds',
        isActive: false,
      },
    ])

    // Act
    const response = await client.get('/api/units-of-measure')

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.length, 2)

    const sortedTestUnits = testUnits.sort((a, b) => a.unit.localeCompare(b.unit))
    const sortedResponseUnits = responseBody.sort((a, b) => a.unit.localeCompare(b.unit))

    sortedTestUnits.forEach((testUnit, index) => {
      assert.equal(sortedResponseUnits[index].unit, testUnit.unit)
      assert.equal(sortedResponseUnits[index].description, testUnit.description)
      assert.equal(sortedResponseUnits[index].isActive, testUnit.isActive)
    })
  })

  test('active returns only active units', async ({ client, assert }) => {
    // Arrange
    await UnitOfMeasure.createMany([
      {
        unit: 'kg',
        description: 'Kilograms',
        isActive: true,
      },
      {
        unit: 'lbs',
        description: 'Pounds',
        isActive: false,
      },
      {
        unit: 'oz',
        description: 'Ounces',
        isActive: true,
      },
    ])

    // Act
    const response = await client.get('/api/units-of-measure/active')

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.length, 2)
    responseBody.forEach((unit: { isActive: unknown }) => {
      assert.isTrue(unit.isActive)
    })
  })

  test('show returns specific unit of measure', async ({ client, assert }) => {
    // Arrange
    const unit = await UnitOfMeasure.create({
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    })

    // Act
    const response = await client.get(`/api/units-of-measure/${unit.id}`)

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.unit, unit.unit)
    assert.equal(responseBody.description, unit.description)
    assert.equal(responseBody.isActive, unit.isActive)
  })

  test('show returns 404 for non-existent unit', async ({ client }) => {
    const response = await client.get('/api/units-of-measure/999')
    response.assertStatus(404)
  })

  test('store creates new unit of measure', async ({ client, assert }) => {
    // Arrange
    const testData = {
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    }

    // Act
    const response = await client.post('/api/units-of-measure').json(testData)

    // Assert
    response.assertStatus(201)
    const responseBody = response.body()
    assert.equal(responseBody.unit, testData.unit)
    assert.equal(responseBody.description, testData.description)
    assert.equal(responseBody.isActive, testData.isActive)

    const unit = await UnitOfMeasure.findBy('unit', testData.unit)
    assert.exists(unit)
  })

  test('store defaults isActive to true when not provided', async ({ client, assert }) => {
    // Arrange
    const testData = {
      unit: 'kg',
      description: 'Kilograms',
    }

    // Act
    const response = await client.post('/api/units-of-measure').json(testData)

    // Assert
    response.assertStatus(201)
    const responseBody = response.body()
    assert.isTrue(responseBody.isActive)
  })

  test('store validates unique unit constraint', async ({ client }) => {
    // Arrange
    await UnitOfMeasure.create({
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    })

    // Act
    const response = await client.post('/api/units-of-measure').json({
      unit: 'kg',
      description: 'Different description',
      isActive: true,
    })

    // Assert
    response.assertStatus(422)
  })

  test('update modifies unit of measure', async ({ client, assert }) => {
    // Arrange
    const unit = await UnitOfMeasure.create({
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    })

    const updateData = {
      unit: 'kgs',
      description: 'Updated Kilograms',
      isActive: false,
    }

    // Act
    const response = await client.put(`/api/units-of-measure/${unit.id}`).json(updateData)

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.unit, updateData.unit)
    assert.equal(responseBody.description, updateData.description)
    assert.equal(responseBody.isActive, updateData.isActive)
  })

  test('toggleActive switches active status', async ({ client, assert }) => {
    // Arrange
    const unit = await UnitOfMeasure.create({
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    })

    // Act
    const response = await client.patch(`/api/units-of-measure/${unit.id}/toggle-active`)

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.isActive, false)

    await unit.refresh()
    assert.equal(unit.isActive, false)
  })

  test('destroy removes unit of measure', async ({ client, assert }) => {
    // Arrange
    const unit = await UnitOfMeasure.create({
      unit: 'kg',
      description: 'Kilograms',
      isActive: true,
    })

    // Act
    const response = await client.delete(`/api/units-of-measure/${unit.id}`)

    // Assert
    response.assertStatus(204)

    const deletedUnit = await UnitOfMeasure.find(unit.id)
    assert.notExists(deletedUnit)
  })

  test('destroy returns 404 for non-existent unit', async ({ client }) => {
    const response = await client.delete('/api/units-of-measure/999')
    response.assertStatus(404)
  })
})
