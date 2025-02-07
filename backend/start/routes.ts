/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const SupplyController = () => import('#controllers/supplies_controller')
const SuppliersController = () => import('#controllers/suppliers_controllers')
const UnitOfMeasuresController = () => import('#controllers/unit_of_measures_controller')
const IngredientsController = () => import('#controllers/ingredients_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .group(() => {
    router.get('/', [SupplyController, 'index'])
    router.post('/', [SupplyController, 'store'])
    router.get('/:id', [SupplyController, 'show'])
    router.put('/:id', [SupplyController, 'update'])
    router.delete('/:id', [SupplyController, 'destroy'])
  })
  .prefix('/api/supplies')

router
  .group(() => {
    router.get('/', [SuppliersController, 'index'])
    router.post('/', [SuppliersController, 'store'])
    router.get('/:id', [SuppliersController, 'show'])
    router.put('/:id', [SuppliersController, 'update'])
    router.delete('/:id', [SuppliersController, 'destroy'])
  })
  .prefix('/api/suppliers')

router
  .group(() => {
    router.get('/', [UnitOfMeasuresController, 'index'])
    router.get('/active', [UnitOfMeasuresController, 'active'])
    router.post('/', [UnitOfMeasuresController, 'store'])
    router.get('/:id', [UnitOfMeasuresController, 'show'])
    router.put('/:id', [UnitOfMeasuresController, 'update'])
    router.patch('/:id/toggle-active', [UnitOfMeasuresController, 'toggleActive'])
    router.delete('/:id', [UnitOfMeasuresController, 'destroy'])
  })
  .prefix('/api/units-of-measure')

router
  .group(() => {
    router.get('/', [IngredientsController, 'index'])
    router.post('/', [IngredientsController, 'store'])
    router.get('/:id', [IngredientsController, 'show'])
    router.put('/:id', [IngredientsController, 'update'])
    router.delete('/:id', [IngredientsController, 'destroy'])
  })
  .prefix('/api/ingredients')

router
  .group(() => {
    // Public routes
    router.post('/register', [UsersController, 'register'])
    router.post('/login', [UsersController, 'login'])

    // Protected routes
    router
      .group(() => {
        router.get('/profile', [UsersController, 'profile'])
        router.put('/profile', [UsersController, 'updateProfile'])
        router.put('/change-password', [UsersController, 'changePassword'])

        // Admin only routes
        router.get('/users', [UsersController, 'index'])
        router.put('/users/:id/role', [UsersController, 'updateRole'])
        router.delete('/users/:id', [UsersController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
