import bcrypt from "bcrypt"
import joi from "joi"

import connection from "../../database.js"

export async function validateSignUp(req, res, next) {
    
    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref("password"),
    })

    const validation = signUpSchema.validate(req.body)
    if (validation.error) {
        return res.status(422).send(validation.error)
    }

    next()
}

export async function validateSignIn(req, res, next) {
    const { email, password } = req.body

    const signInSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })

    const validation = signInSchema.validate(req.body)
    if (validation.error) {
        return res.status(422).send(validation.error)
    }

    try {
        const exists = await connection.query(
            `SELECT * FROM users 
            WHERE users.email = $1
            `,
            [email]
        )
        if (!exists.rows[0]) return res.sendStatus(401)

        const passwordCheck = bcrypt.compareSync(
            password,
            exists.rows[0].password
        )
        if (!passwordCheck) return res.sendStatus(401)

        res.locals.user = exists.rows[0]

        next()
    } catch (e) {
        res.status(500).send(e)
    }
}


export async function validateURL(req, res, next) {
    const shortenURLSchema = joi.object({
        url: joi.string().uri().required(),
    })

    const validation = shortenURLSchema.validate(req.body)
    if (validation.error) {
        return res.status(422).send(validation.error)
    }

    next()
}

export async function validateToken(req, res, next) {
    const { authorization } = req.headers

    try {
        const token = authorization?.replace("Bearer ", "").trim()
        if (!token) return res.sendStatus(401)

        const exists = await connection.query(
            `SELECT * FROM tokens
            WHERE tokens.name = $1
            `,
            [token]
        )
        if (!exists.rows[0]) return res.sendStatus(401)

        const key = process.env.JWT_SECRET
        const tokenVerification = jwt.verify(token, key)

        if (!tokenVerification) return res.sendStatus(401)

        res.locals.user = exists.rows[0]

        next()
    } catch (e) {
        return res.status(500).send(e)
    }
}

export async function validateUrlDelete(req, res, next) {
    const { id } = req.params
    const { user } = res.locals

    try {
        const query = await connection.query(
            `SELECT * FROM links
            WHERE id = $1
            `,
            [id]
        )
        if (!query.rows[0]) return res.sendStatus(404)
        if (query.rows[0].userId !== user.userId) return res.sendStatus(401)

        next()
    } catch (e) {
        return res.status(500).send(e)
    }
}