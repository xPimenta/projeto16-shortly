import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import chalk from "chalk"
dotenv.config()

import usersRouter from "./src/routes/usersRouter.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use(usersRouter)

app.listen(process.env.PORT || 4000, () =>
    console.log(
        chalk.blue.bold(`Server running on port ${process.env.PORT || 4000}`)
    )
)