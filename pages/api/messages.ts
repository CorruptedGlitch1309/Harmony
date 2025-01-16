import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchServers(channel_id: string) {
    try {
        const client = await pool.connect();

        const data = (await client.query(
            `SELECT messages.user_id, messages.message, users.username, users."icon-url"
            FROM messages 
            INNER JOIN users ON messages.user_id = users.user_id
            WHERE messages.channel_id = '${channel_id}'
            AND messages.hidden = 'false'
            ORDER BY messages.xata_createdat`
        )).rows;

        client.release();
        return data;
    } catch (error) {
        console.log("Could not fetch users: ", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await fetchServers(req.body);
    res.status(200).json(data);
}