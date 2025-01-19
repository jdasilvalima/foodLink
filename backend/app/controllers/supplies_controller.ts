import { HttpContext } from '@adonisjs/core/http'
import Supply from '#models/supply'
import { createSupplyValidator } from '#validators/supply'

export default class SuppliesController {
  /**
   * Display a list of all supplies
   */
  async index({ response }: HttpContext) {
    const supplies = await Supply.all()
    return response.json(supplies)
  }

  /**
   * Store a new supply
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSupplyValidator)
    const supply = await Supply.create(data)
    return response.created(supply)
  }

  /**
   * Display a specific supply
   */
  async show({ params, response }: HttpContext) {
    const supply = await Supply.find(params.id)
    if (!supply) {
      return response.notFound({ message: 'Supply not found' })
    }
    return response.json(supply)
  }

  /**
   * Update a supply
   */
  async update({ params, request, response }: HttpContext) {
    const supply = await Supply.find(params.id)
    if (!supply) {
      return response.notFound({ message: 'Supply not found' })
    }

    const data = await request.validateUsing(createSupplyValidator)
    supply.merge(data)
    await supply.save()

    return response.json(supply)
  }

  /**
   * Delete a supply
   */
  async destroy({ params, response }: HttpContext) {
    const supply = await Supply.find(params.id)
    if (!supply) {
      return response.notFound({ message: 'Supply not found' })
    }

    await supply.delete()
    return response.noContent()
  }
}
