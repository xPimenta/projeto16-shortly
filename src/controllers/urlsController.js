import { nanoid } from "nanoid"
import dayjs from "dayjs"

import connection from "../../database.js"

export async function shortenURL(req, res) {
    const { url } = req.body
    const { user } = res.locals

    try {
        const shortURL = nanoid(8)
        const now = dayjs().format("DD/MM/YYYY HH:mm:ss")

        const query = await connection.query(
            `INSERT INTO links (url, "shortUrl", "userId", visits, "createdAt")
            VALUES ($1, $2, $3, $4, $5)
            `,
            [url, shortURL, user.userId, 0, now]
        )

        return res.status(201).send({ shortUrl: shortURL })
    } catch (e) {
        res.status(500).send(e)
    }
}
