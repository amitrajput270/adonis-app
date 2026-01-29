import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'


router.on('/').render('pages/landing')
// Posts CRUD routes
router.group(() => {
    router.group(() => {
        router.post('/upload', '#controllers/fees_data_controller.upload')
        router.get('/', '#controllers/fees_data_controller.index')
        router.get('/stats', '#controllers/fees_data_controller.stats')
        router.get('/:id', '#controllers/fees_data_controller.show')
        router.delete('/:id', '#controllers/fees_data_controller.destroy')
    }).prefix('fees-data')

    router.group(() => {
        router.get('/', '#controllers/posts_controller.index')
        router.post('/', '#controllers/posts_controller.store')
        router.get('/:id', '#controllers/posts_controller.show')
        router.put('/:id', '#controllers/posts_controller.update')
        router.patch('/:id', '#controllers/posts_controller.update')
        router.delete('/:id', '#controllers/posts_controller.destroy')
    }).prefix('posts')

    // Auth routes
    router.group(() => {
        router.get('/register', '#controllers/auth_controller.register')
        router.post('/register', '#controllers/auth_controller.register')
        router.post('/login', '#controllers/auth_controller.login')
        router.post('/logout', '#controllers/auth_controller.logout').use(middleware.auth())
    }).prefix('auth')

}).prefix('api')

