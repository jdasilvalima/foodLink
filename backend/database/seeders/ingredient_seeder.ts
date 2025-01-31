import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ingredient from '#models/ingredient'

export default class extends BaseSeeder {
  async run() {
    await Ingredient.createMany([
      {
        name: 'Wheat Flour',
      },
      {
        name: 'Sugar',
      },
      {
        name: 'Salt',
      },
      {
        name: 'Milk Powder',
      },
      {
        name: 'Cocoa Powder',
      },
      {
        name: 'Vanilla Extract',
      },
      {
        name: 'Baking Powder',
      },
      {
        name: 'Butter',
      },
      {
        name: 'Eggs',
      },
      {
        name: 'Vegetable Oil',
      },
    ])
  }
}
