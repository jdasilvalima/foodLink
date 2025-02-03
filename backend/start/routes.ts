/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const SupplyController = () => import('#controllers/supplies_controller')
const SuppliersController = () => import('#controllers/suppliers_controllers')

router.group(() => {
  router.get('/', [SupplyController, 'index'])
  router.post('/', [SupplyController, 'store'])
  router.get('/:id', [SupplyController, 'show'])
  router.put('/:id', [SupplyController, 'update'])
  router.delete('/:id', [SupplyController, 'destroy'])
}).prefix('/api/supplies')

router.group(() => {
  router.get('/', [SuppliersController, 'index'])
  router.post('/', [SuppliersController, 'store'])
  router.get('/:id', [SuppliersController, 'show'])
  router.put('/:id', [SuppliersController, 'update'])
  router.delete('/:id', [SuppliersController, 'destroy'])
}).prefix('/api/suppliers')