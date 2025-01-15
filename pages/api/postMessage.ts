import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function createServer(
    { user_id, channel_id, message }:
        { user_id: string, channel_id: string, message: string }) {

    try {
        const client = await pool.connect();

        const xata_id = (await client.query(`SELECT COUNT(*) FROM messages`)).rows[0].count;

        client.query(
            `INSERT INTO
            "messages" ("xata_id", "channel_id", "message", "user_id")
            VALUES
            (
                '${xata_id}',
                '${channel_id}',
                '${message}',
                '${user_id}'
            );`
        );

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
    const data = await createServer(req.body);
    res.status(200).json(data);
}