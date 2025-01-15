import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function joinServer({ user_id, server_id }: { user_id: string, server_id: string }) {
    try {
        const client = await pool.connect();

        const doesServerExist = (await client.query(
            `SELECT COUNT(*) FROM "servers" WHERE server_id = '${server_id}'`
        )).rows[0].count;

        if (doesServerExist > 0) {
            const servers = (await client.query(
                `SELECT "servers" FROM "users" WHERE user_id = '${user_id}'`
            )).rows[0].servers.servers;

            const inServer = [...servers].filter((server: string) => server == server_id).length;

            const newServers = [...servers, server_id];

            if (inServer == 0) {
                await client.query(
                    `UPDATE "users"
                    SET "servers" = '{ "servers": ${JSON.stringify(newServers)}}'
                    WHERE "user_id" = '${user_id}'`
                );
            }
        }



        const result = await client.query(`SELECT "servers" FROM "users" WHERE user_id = '${user_id}'`);
        const data = result.rows[0].servers.servers;

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
    const data = await joinServer(req.body);
    res.status(200).json(data);
}