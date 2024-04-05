const { Router } = require('express')
const MovieController = require('../controllers/MovieController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const movieRouter = Router()
const movieController = new MovieController()

movieRouter.use(ensureAuthenticated)

movieRouter.get('/', movieController.index)
movieRouter.post('/', movieController.create)

movieRouter.get('/:id', movieController.show)
movieRouter.delete('/:id', movieController.deleteMovie)

module.exports = movieRouter
