import { Router } from "express"

import {
    validateSignIn,
    validateSignUp,
} from "../middlewares/validation.js"
import {
    signIn,
    signUp,
} from "../controllers/usersController.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSignUp, signUp)
usersRouter.post("/signin", validateSignIn, signIn)

export default usersRouter