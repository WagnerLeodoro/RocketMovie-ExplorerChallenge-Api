const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class MovieController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body
    const { id } = req.user

    if (rating < 0 || rating > 5) {
      throw new AppError("Escolha uma nota de 1 a 5")
    }

    const [movie_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id: id,
    })

    const tagsInsert = tags.map((name) => {
      return {
        movie_id,
        name,
        user_id: id,
      }
    })

    await knex("movie_tags").insert(tagsInsert)

    res.status(201).json("Filme cadastrado com sucesso!")
  }

  async show(req, res) {
    const { id } = req.params

    const movie = await knex("movie_notes").where({ id })
    const tags = await knex("movie_tags")
      .where({ movie_id: id })
      .orderBy("name")

    const movieTags = movie.map((movie) => {
      return {
        ...movie,
        tags,
      }
    })

    return res.status(200).json(movieTags)
  }

  async deleteMovie(req, res) {
    const { id } = req.params
    await knex("movie_notes").where({ id }).delete()

    return res.status(200).json("Registro deletado com sucesso!")
  }

  async index(req, res) {
    const { title, tags } = req.query
    const user_id = req.user.id

    let movies

    if (tags) {
      const filterTags = tags.split(",").map((tag) => {
        tag.trim()
      })

      movies = await knex("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_id")
        .groupBy("movie_notes.id")
        .orderBy("movie_notes.title")
    } else {
      movies = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }

    const userTags = await knex("movie_tags").where({ user_id })

    const moviesWithTags = movies.map((movie) => {
      const movieTags = userTags.filter((tag) => tag.movie_id === movie.id)
      return {
        ...movie,
        tags: movieTags,
      }
    })

    return res.status(200).json(moviesWithTags)
  }
}

module.exports = MovieController
