const { compare, hash } = require("bcryptjs")
const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body

    const [checkUserExists] = await knex("users").where({ email })

    if (checkUserExists) {
      throw new AppError("Este email já está em uso")
    }

    const hashedPassword = await hash(password, 8)

    const [user_id] = await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    })

    return res.status(201).json(user_id)
  }

  async listUser(req, res) {
    const { id } = req.user

    const user = await knex("users")
      .where({ id })
      .select("name", "email", "avatar")

    return res.status(200).json(user)
  }

  async updateUser(req, res) {
    const { name, email, password, old_password } = req.body
    const { id } = req.user

    const [user] = await knex("users").where({ id })

    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    const [userWithUpdatedEmail] = await knex("users").where({ email })

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha",
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("A senha informada não confere com a senha antiga")
      }
      user.password = await hash(password, 8)
    }

    await knex("users").where({ id }).update({ name, email, password }),
      [user.name, user.email, user.password]

    return res.status(200).json()
  }

  async deleteUser(req, res) {
    const { id } = req.params

    const [user] = await knex("users").where({ id })

    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    await knex("users").where({ id }).delete()

    res.status(200).json("Registro deletado com sucesso!")
  }
}

module.exports = UserController
