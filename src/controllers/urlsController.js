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

export async function getUrlById(req, res) {
    const { id } = req.params
    try {
        const query = await connection.query(
            `SELECT * FROM links
            WHERE links.id = $1
            `,
            [id]
        )

        if (!query.rows[0]) return res.sendStatus(404)

        const { shortUrl, url } = query.rows[0]

        return res.status(200).send({ id: id, shortUrl: shortUrl, url: url })
    } catch (e) {
        res.status(500).send(e)
    }
}

export async function redirectToUrl(req, res) {
    const { shortUrl } = req.params
    try {
        const exists = await connection.query(
            `SELECT * FROM links
            WHERE links."shortUrl" = $1
            `,
            [shortUrl]
        )
        if (!exists.rows[0]) return res.sendStatus(404)

        const query = await connection.query(
            `UPDATE links
            SET visits = visits + 1
            WHERE links."shortUrl" = $1
            `,
            [shortUrl]
        )

        const { url } = exists.rows[0]
        return res.redirect(url)
    } catch (e) {
        res.status(500).send(e)
    }
}
