import { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'
import { createSupplierValidator } from '#validators/supplier'

export default class SuppliersController {
  /**
   * Display a list of all suppliers
   */
  async index({ response }: HttpContext) {
    const suppliers = await Supplier.all()
    return response.json(suppliers)
  }

  /**
   * Store a new supplier
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSupplierValidator)
    const supplier = await Supplier.create(data)
    return response.created(supplier)
  }

  /**
   * Display a specific supplier
   */
  async show({ params, response }: HttpContext) {
    const supplier = await Supplier.find(params.id)
    if (!supplier) {
      return response.notFound({ message: 'Supplier not found' })
    }
    return response.json(supplier)
  }

  /**
   * Update a supplier
   */
  async update({ params, request, response }: HttpContext) {
    const supplier = await Supplier.find(params.id)
    if (!supplier) {
      return response.notFound({ message: 'Supplier not found' })
    }

    const data = await request.validateUsing(createSupplierValidator)
    supplier.merge(data)
    await supplier.save()

    return response.json(supplier)
  }

  /**
   * Delete a supplier
   */
  async destroy({ params, response }: HttpContext) {
    const supplier = await Supplier.find(params.id)
    if (!supplier) {
      return response.notFound({ message: 'Supplier not found' })
    }

    await supplier.delete()
    return response.noContent()
  }
}
