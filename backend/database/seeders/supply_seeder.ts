import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Supply from '#models/supply'

export default class extends BaseSeeder {
  async run() {
    await Supply.createMany([
      {
        number: 'RM001',
        name: 'Wheat Flour',
        unitType: 'bag',
        unitsPerPackage: 25,
        type: 'raw_material',
      },
      {
        number: 'RM002',
        name: 'Sugar',
        unitType: 'bag',
        unitsPerPackage: 50,
        type: 'raw_material',
      },
      {
        number: 'RM003',
        name: 'Milk Powder',
        unitType: 'bag',
        unitsPerPackage: 25,
        type: 'raw_material',
      },
      {
        number: 'RM004',
        name: 'Cocoa Powder',
        unitType: 'cs',
        unitsPerPackage: 10,
        type: 'raw_material',
      },
      {
        number: 'RM005',
        name: 'Palm Oil',
        unitType: 'barrel',
        unitsPerPackage: 200,
        type: 'raw_material',
      },
      {
        number: 'RM006',
        name: 'Cardboard Boxes',
        unitType: 'cs',
        unitsPerPackage: 100,
        type: 'packaging',
      },
      {
        number: 'RM007',
        name: 'Plastic Bags',
        unitType: 'bag',
        unitsPerPackage: 1000,
        type: 'packaging',
      },
    ])
  }
}
