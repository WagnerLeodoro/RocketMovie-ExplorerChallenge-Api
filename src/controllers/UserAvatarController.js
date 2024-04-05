const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")
const AppError = require("../utils/AppError")

class UserAvatarController {
  async update(req, res) {
    const user_id = req.user.id
    const avatarFileName = req.file.filename

    const diskStorage = new DiskStorage()

    const user = await knex("users").where({ id: user_id }).first()

    if (!user) {
      throw new AppError("Somente usuários podem mudar o avatar", 401)
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFileName)
    user.avatar = filename

    await knex("users").where({ id: user_id }).update(user)

    return res.status(200).json(user)
  }
}

module.exports = UserAvatarController
