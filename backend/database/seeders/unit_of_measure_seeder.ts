import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UnitOfMeasure from '#models/unit_of_measure'

export default class extends BaseSeeder {
  async run() {
    await UnitOfMeasure.createMany([
      {
        unit: 'LBS',
        description: 'Pounds',
        isActive: true,
      },
      {
        unit: 'OZ',
        description: 'Ounces',
        isActive: true,
      },
      {
        unit: 'KG',
        description: 'Kilograms',
        isActive: true,
      },
      {
        unit: 'G',
        description: 'Grams',
        isActive: true,
      },
      {
        unit: 'CS',
        description: 'Cases',
        isActive: true,
      },
      {
        unit: 'BAG',
        description: 'Bags',
        isActive: true,
      },
      {
        unit: 'PCS',
        description: 'Pieces',
        isActive: true,
      },
    ])
  }
}
