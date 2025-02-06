import { HttpContext } from '@adonisjs/core/http'
import Ingredient from '#models/ingredient'
import { createIngredientValidator, updateIngredientValidator } from '#validators/ingredient'

export default class IngredientsController {
  /**
   * Display a list of all ingredients
   */
  async index({ response }: HttpContext) {
    const ingredients = await Ingredient.all()
    return response.json(ingredients)
  }

  /**
   * Store a new ingredient
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createIngredientValidator)
    const ingredient = await Ingredient.create(data)
    return response.created(ingredient)
  }

  /**
   * Display a specific ingredient
   */
  async show({ params, response }: HttpContext) {
    const ingredient = await Ingredient.find(params.id)
    if (!ingredient) {
      return response.notFound({ message: 'Ingredient not found' })
    }
    return response.json(ingredient)
  }

  /**
   * Update an ingredient
   */
  async update({ params, request, response }: HttpContext) {
    const ingredient = await Ingredient.find(params.id)
    if (!ingredient) {
      return response.notFound({ message: 'Ingredient not found' })
    }

    const data = await request.validateUsing(updateIngredientValidator(ingredient.id))
    ingredient.merge(data)
    await ingredient.save()

    return response.json(ingredient)
  }

  /**
   * Delete an ingredient
   */
  async destroy({ params, response }: HttpContext) {
    const ingredient = await Ingredient.find(params.id)
    if (!ingredient) {
      return response.notFound({ message: 'Ingredient not found' })
    }

    await ingredient.delete()
    return response.noContent()
  }
}
