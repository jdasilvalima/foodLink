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

router.group(() => {
  router.get('/', [SupplyController, 'index'])
  router.post('/', [SupplyController, 'store'])
  router.get('/:id', [SupplyController, 'show'])
  router.put('/:id', [SupplyController, 'update'])
  router.delete('/:id', [SupplyController, 'destroy'])
}).prefix('/api/supplies')
