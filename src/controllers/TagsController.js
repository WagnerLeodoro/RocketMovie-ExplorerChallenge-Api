const knex = require("../database/knex")

class TagsController {
  async index(req, res) {
    const user_id = req.user.id
    const tags = await knex("movie_tags").where({ user_id })

    const tagsGroupedByMovie = tags.reduce((acc, tag) => {
      if (!acc[tag.movie_id]) {
        acc[tag.movie_id] = []
      }
      acc[tag.movie_id].push(tag.name)
      return acc
    }, {})

    return res.status(200).json(tagsGroupedByMovie)
  }
}

module.exports = TagsController
