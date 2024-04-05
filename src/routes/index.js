const { Router } = require('express')
const userRouter = require('./users.routes')
const movieRouter = require('./movie.routes')
const tagsRouter = require('./tags.routes')
const sessionRouter = require('./session.routes')

const routes = Router()

routes.use('/session', sessionRouter)
routes.use('/users', userRouter)
routes.use('/movies', movieRouter)
routes.use('/tags', tagsRouter)

module.exports = routes
