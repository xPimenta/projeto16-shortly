import jwt from "jsonwebtoken"
import dayjs from "dayjs"
import bcrypt from "bcrypt"

import connection from "../../database.js"

export async function signUp(req, res) {
    const { email, name, password } = req.body
    try {
        const passwordHash = bcrypt.hashSync(password, 10)
        const now = dayjs().format("DD/MM/YYYY HH:mm:ss")
        const query = await connection.query(
            `INSERT INTO users (email, name, password, "createdAt") 
            VALUES ($1, $2, $3, $4)`,
            [email, name, passwordHash, now]
        )
        return res.sendStatus(201)
    } catch (e) {
        res.status(500).send(e)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body
    const { user } = res.locals

    try {
        const key = process.env.JWT_SECRET
        const tokenConfig = { expiresIn: 60 * 60 * 12 }
        const token = jwt.sign({ email: email }, key, tokenConfig)
        const now = dayjs().format("DD/MM/YYYY HH:mm:ss")

        const query = await connection.query(
            `INSERT INTO tokens (name, "userId", "createdAt")
            VALUES ($1, $2, $3)
            `,
            [token, user.id, now]
        )

        return res.status(200).send(token)
    } catch (e) {
        res.status(500).send(e)
    }
}

export async function getUserInfo(req, res) {
    const { id } = req.params
    const { user } = res.locals
    try {
        const query = await connection.query(
            `SELECT id, "shortUrl", url, visits AS "visitCount" FROM links
            WHERE "userId" = $1
            ORDER BY id
            `,
            [id]
        )

        const shortenedUrls = query.rows
        res.status(200).send({ ...user, shortenedUrls })
    } catch (e) {
        res.status(500).send(e)
    }
}

export async function getTopUsers(req, res) {
    try {
        const query = await connection.query(
            `SELECT users.id, users.name, COUNT(links.id) "linksCount", COALESCE(SUM(links.visits), 0) "visitCount" FROM users
            LEFT JOIN links ON links."userId" = users.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10
            `
        )

        return res.status(200).send(query.rows)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}

