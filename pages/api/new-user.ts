import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchUsers(email: string, user_id: string) {
    try {
        const client = await pool.connect();

        const count = await client.query(`SELECT COUNT(*) FROM users`);
        const id = Number(count.rows[0].count);

        client.query(`
            INSERT INTO "users" ("xata_id", "email", "user_id")
            VALUES ('${id}', '${email}', '${user_id}')
            `);

        client.release();
    } catch (error) {
        console.log("Could not fetch users: ", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    fetchUsers(req.body.email, req.body.user_id);
    res.status(200).json({ success: true });
}