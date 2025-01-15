import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function createChannel(
    { server_id, channel_name }:
        { server_id: string, channel_name: string }) {
    try {
        const client = await pool.connect();

        const random_id = async (table: string) => {
            function randomLetter() {
                const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const randomNum = Math.floor(Math.random() * letters.length);
                const randomLetter = letters.charAt(randomNum);
                return randomLetter;
            };
            const string = []
            for (let i = 0; i < 6; i++) string.unshift(randomLetter())
            const stringUnique = (
                await client.query(
                    `SELECT COUNT(*) FROM "${table}s" WHERE "${table}_id" = '${string.join("")}'`
                )
            ).rows[0].count;
            if (stringUnique > 0) return random_id(table);
            return string.join("");
        }

        const channel_id = await random_id("channel");
        const channel_xata_id = (await client.query(`SELECT COUNT(*) FROM "channels"`)).rows[0].count;

        client.query(
            `INSERT INTO
            "channels" ("xata_id", "channel_name", "server_id", "channel_id")
            VALUES
            ('${channel_xata_id}', '${channel_name}', '${server_id}', '${channel_id}');
            `);

        client.release();
        return { success: true };
    } catch (error) {
        console.log("Could not fetch users: ", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await createChannel(req.body);
    res.status(200).json(data);
}