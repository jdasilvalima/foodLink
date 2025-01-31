import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {
    await Supplier.createMany([
      {
        name: 'Global Foods Inc.',
        email: 'contact@globalfoods.com',
        phoneNumber: '+1-555-123-4567',
      },
      {
        name: 'Premium Packaging Solutions',
        email: 'sales@premiumpack.com',
        phoneNumber: '+1-555-234-5678',
      },
      {
        name: 'Fresh Ingredients Co.',
        email: 'info@freshingredients.com',
        phoneNumber: '+1-555-345-6789',
      },
      {
        name: 'Quality Dairy Products',
        email: 'orders@qualitydairy.com',
        phoneNumber: '+1-555-456-7890',
      },
      {
        name: 'Organic Farms Direct',
        email: 'service@organicfarms.com',
        phoneNumber: '+1-555-567-8901',
      },
    ])
  }
}
