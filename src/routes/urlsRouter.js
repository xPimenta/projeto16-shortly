import { Router } from "express"

import {
    validateToken,
    validateURL,
} from "../middlewares/validation.js"
import {
    shortenURL,
} from "../controllers/urlsController.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateURL, validateToken, shortenURL)

export default urlsRouter