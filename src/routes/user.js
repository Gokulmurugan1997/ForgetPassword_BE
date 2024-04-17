import express from "express"
import userController from "../controllers/user.js"
import validate from "../middleWare/validate.js"
const router = express.Router()

router.get("/",userController.getAllUser)
router.get("/:id", validate, userController.getAllUserByid)
router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.post("/forgetPassword", userController.forgetPassword)
router.post('/reset-password', userController.resetPassword);



export default router 