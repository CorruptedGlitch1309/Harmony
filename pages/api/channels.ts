import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchChannels(user_id: string) {
    try {
        const client = await pool.connect();

        const data = (await client.query(
            `SELECT "channel_name", "channel_id"
            FROM channels 
            WHERE "server_id" = '${user_id}'`
        )).rows;

        client.release();
        return data;
    } catch (error) {
        console.log("Could not fetch channels: ", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await fetchChannels(req.body);
    res.status(200).json(data);
}