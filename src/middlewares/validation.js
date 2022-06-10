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