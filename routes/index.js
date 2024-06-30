const router = require('express')
const auth = require('./auth.routes')
const tasks = require('./tasks.routes')
const category = require('./category.routes')
const routes = router.Router()

routes.use('/auth', auth)
routes.use('/category', category)
routes.use('/tasks', tasks)


module.exports = routes