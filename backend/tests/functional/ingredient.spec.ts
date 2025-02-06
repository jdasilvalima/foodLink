import { test } from '@japa/runner'
import Ingredient from '#models/ingredient'

test.group('Ingredients Controller', (group) => {
  group.each.setup(async () => {
    await Ingredient.query().delete()
  })

  test('index returns all ingredients', async ({ client, assert }) => {
    // Arrange
    const testIngredients = await Ingredient.createMany([
      {
        name: 'Sugar',
      },
      {
        name: 'Salt',
      },
    ])

    // Act
    const response = await client.get('/api/ingredients')

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.length, 2)

    const sortedTestIngredients = testIngredients.sort((a, b) => a.name.localeCompare(b.name))
    const sortedResponseIngredients = responseBody.sort((a, b) => a.name.localeCompare(b.name))

    sortedTestIngredients.forEach((testIngredient, index) => {
      assert.equal(sortedResponseIngredients[index].name, testIngredient.name)
    })
  })

  test('show returns specific ingredient', async ({ client, assert }) => {
    // Arrange
    const ingredient = await Ingredient.create({
      name: 'Flour',
    })

    // Act
    const response = await client.get(`/api/ingredients/${ingredient.id}`)

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.name, ingredient.name)
  })

  test('show returns 404 for non-existent ingredient', async ({ client }) => {
    const response = await client.get('/api/ingredients/999')
    response.assertStatus(404)
  })

  test('store creates new ingredient', async ({ client, assert }) => {
    // Arrange
    const testData = {
      name: 'Cocoa Powder',
    }

    // Act
    const response = await client.post('/api/ingredients').json(testData)

    // Assert
    response.assertStatus(201)
    const responseBody = response.body()
    assert.equal(responseBody.name, testData.name)

    const ingredient = await Ingredient.findBy('name', testData.name)
    assert.exists(ingredient)
  })

  test('store validates unique name constraint', async ({ client, assert }) => {
    // Arrange
    await Ingredient.create({
      name: 'Vanilla Extract',
    })

    // Act
    const response = await client.post('/api/ingredients').json({
      name: 'Vanilla Extract',
    })

    // Assert
    response.assertStatus(422)
    const responseBody = response.body()
    assert.exists(responseBody.errors)
  })

  test('store validates name length', async ({ client }) => {
    // Act
    const response = await client.post('/api/ingredients').json({
      name: 'A',
    })

    // Assert
    response.assertStatus(422)
  })

  test('update modifies ingredient', async ({ client, assert }) => {
    // Arrange
    const ingredient = await Ingredient.create({
      name: 'Original Name',
    })

    const updateData = {
      name: 'Updated Name',
    }

    // Act
    const response = await client.put(`/api/ingredients/${ingredient.id}`).json(updateData)

    // Assert
    response.assertStatus(200)
    const responseBody = response.body()
    assert.equal(responseBody.name, updateData.name)

    await ingredient.refresh()
    assert.equal(ingredient.name, updateData.name)
  })

  test('update returns 404 for non-existent ingredient', async ({ client }) => {
    const updateData = {
      name: 'Updated Name',
    }

    const response = await client.put('/api/ingredients/999').json(updateData)
    response.assertStatus(404)
  })

  test('update validates unique name constraint', async ({ client }) => {
    // Arrange
    const ingredient1 = await Ingredient.create({ name: 'First Ingredient' })
    await Ingredient.create({ name: 'Second Ingredient' })

    // Act
    const response = await client.put(`/api/ingredients/${ingredient1.id}`).json({
      name: 'Second Ingredient',
    })

    // Assert
    response.assertStatus(422)
  })

  test('destroy removes ingredient', async ({ client, assert }) => {
    // Arrange
    const ingredient = await Ingredient.create({
      name: 'To Delete',
    })

    // Act
    const response = await client.delete(`/api/ingredients/${ingredient.id}`)

    // Assert
    response.assertStatus(204)

    const deletedIngredient = await Ingredient.find(ingredient.id)
    assert.notExists(deletedIngredient)
  })

  test('destroy returns 404 for non-existent ingredient', async ({ client }) => {
    const response = await client.delete('/api/ingredients/999')
    response.assertStatus(404)
  })
})
