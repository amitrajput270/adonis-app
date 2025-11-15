/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

// Posts CRUD routes
router.group(() => {
    router.get('/', '#controllers/posts_controller.index')
    router.post('/', '#controllers/posts_controller.store')
    router.get('/:id', '#controllers/posts_controller.show')
    router.put('/:id', '#controllers/posts_controller.update')
    router.patch('/:id', '#controllers/posts_controller.update')
    router.delete('/:id', '#controllers/posts_controller.destroy')
}).prefix('/api/posts')

// Alternative: You can use resource route for a more compact definition
// router.resource('posts', '#controllers/posts_controller').prefix('/api')

// Fees Data routes
router.group(() => {
    router.post('/upload', '#controllers/fees_data_controller.upload')
    router.get('/', '#controllers/fees_data_controller.index')
    router.get('/stats', '#controllers/fees_data_controller.stats')
    router.get('/:id', '#controllers/fees_data_controller.show')
    router.delete('/:id', '#controllers/fees_data_controller.destroy')
}).prefix('/api/fees-data')
