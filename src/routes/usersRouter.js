import { Router } from "express"

import {
    validateSignIn,
    validateSignUp,
    validateToken,
    validateUser,
} from "../middlewares/validation.js"
import {
    getTopUsers,
    getUserInfo,
    signIn,
    signUp,
} from "../controllers/usersController.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSignUp, signUp)
usersRouter.post("/signin", validateSignIn, signIn)
usersRouter.get("/ranking", getTopUsers)
usersRouter.get("/users/:id", validateToken, validateUser, getUserInfo)

export default usersRouter