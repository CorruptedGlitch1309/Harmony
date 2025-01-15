import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchServers(user_id: string) {
    try {
        const client = await pool.connect();

        const queryServers = (await client.query(
            `SELECT "servers" FROM "users" WHERE user_id = '${user_id}'`
        )).rows;

        if (!queryServers[0]) {
            client.release();
            return { error: "failed to fetch servers" }
        }

        const servers = queryServers[0].servers.servers;

        const stringed = [...servers].map((server) => `'${server}'`).join(", ");

        async function getResult() {
            if (stringed.length == 0) return [];
            return (await client.query(
                `SELECT "icon-url", "name", "server_id" 
                FROM "servers" WHERE "server_id" 
                IN (${stringed})`
            )).rows;
        }

        const server_data = await getResult();

        client.release();
        return server_data;
    } catch (error) {
        console.log("Could not fetch servers: ", error);
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