import { Router } from "express"

import {
    validateToken,
    validateURL,
} from "../middlewares/validation.js"
import {
    getUrlById,
    redirectToUrl,
    shortenURL,
} from "../controllers/urlsController.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateURL, validateToken, shortenURL)
urlsRouter.get("/urls/open/:shortUrl", redirectToUrl)
urlsRouter.get("/urls/:id", getUrlById)

export default urlsRouter