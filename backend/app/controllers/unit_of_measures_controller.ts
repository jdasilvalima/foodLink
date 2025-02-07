import { HttpContext } from '@adonisjs/core/http'
import UnitOfMeasure from '#models/unit_of_measure'
import {
  createUnitOfMeasureValidator,
  updateUnitOfMeasureValidator,
} from '#validators/unit_of_measure'

export default class UnitOfMeasuresController {
  /**
   * Display a list of all units of measure
   */
  async index({ response }: HttpContext) {
    const units = await UnitOfMeasure.all()
    return response.json(units)
  }

  /**
   * Get only active units of measure
   */
  async active({ response }: HttpContext) {
    const units = await UnitOfMeasure.query().where('isActive', true)
    return response.json(units)
  }

  /**
   * Store a new unit of measure
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUnitOfMeasureValidator)
    const unit = await UnitOfMeasure.create({
      ...data,
      isActive: data.isActive ?? true,
    })
    return response.created(unit)
  }

  /**
   * Display a specific unit of measure
   */
  async show({ params, response }: HttpContext) {
    const unit = await UnitOfMeasure.find(params.id)
    if (!unit) {
      return response.notFound({ message: 'Unit of measure not found' })
    }
    return response.json(unit)
  }

  /**
   * Update a unit of measure
   */
  async update({ params, request, response }: HttpContext) {
    const unit = await UnitOfMeasure.find(params.id)
    if (!unit) {
      return response.notFound({ message: 'Unit of measure not found' })
    }

    const data = await request.validateUsing(updateUnitOfMeasureValidator(unit.id))
    unit.merge(data)
    await unit.save()

    return response.json(unit)
  }

  /**
   * Toggle unit of measure active status
   */
  async toggleActive({ params, response }: HttpContext) {
    const unit = await UnitOfMeasure.find(params.id)
    if (!unit) {
      return response.notFound({ message: 'Unit of measure not found' })
    }

    unit.isActive = !unit.isActive
    await unit.save()

    return response.json(unit)
  }

  /**
   * Delete a unit of measure
   */
  async destroy({ params, response }: HttpContext) {
    const unit = await UnitOfMeasure.find(params.id)
    if (!unit) {
      return response.notFound({ message: 'Unit of measure not found' })
    }

    await unit.delete()
    return response.noContent()
  }
}
