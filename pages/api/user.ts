import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchUser(user_id: string) {
    try {
        const client = await pool.connect();

        const result = await client.query(
            `SELECT "username", "icon-url"
            FROM users
            WHERE "user_id" = '${user_id}'`
        );
        const data = result.rows[0];

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
    const data = await fetchUser(req.body);
    res.status(200).json(data);
}