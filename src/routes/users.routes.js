const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UserController = require("../controllers/UserController")
const UserAvatarController = require("../controllers/UserAvatarController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const userRouter = Router()
const upload = multer(uploadConfig.MULTER)

const userController = new UserController()
const userAvatarController = new UserAvatarController()

userRouter.post("/", userController.create)

userRouter.use(ensureAuthenticated)

userRouter.get("/", userController.listUser)
userRouter.put("/", userController.updateUser)
userRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  userAvatarController.update,
)
userRouter.delete("/:id", userController.deleteUser)

module.exports = userRouter
