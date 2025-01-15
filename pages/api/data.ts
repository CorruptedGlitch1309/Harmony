import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function fetchServers(
    {
        user_id,
        server_id = "none",
        channel_id = "none"
    }: {
        user_id: string,
        server_id: string,
        channel_id: string
    }) {
    try {
        const client = await pool.connect();

        const queryServers = (await client.query(
            `SELECT "servers" FROM "users" WHERE user_id = '${user_id}'`
        )).rows;

        if (!queryServers[0]) {
            client.release();
            return { success: false }
        }

        const servers = queryServers[0].servers.servers;

        if (servers.length == 0) return {
            success: false,
            server_data: [],
            channels: [],
            selectedChannel: "none",
            selectedServer: "none",
        }

        const stringed = [...servers].map((server) => `'${server}'`).join(", ");

        async function getResult() {
            if (stringed.length == 0) return [];
            return (await client.query(
                `SELECT "icon-url", "name", "server_id", "owner"
                FROM "servers" WHERE "server_id" 
                IN (${stringed})`
            )).rows;
        }

        const server_data = await getResult();
        const selectedServer = server_id == "none" ? servers[0] : server_id;
        const channels = (await client.query(
            `SELECT "channel_id", "channel_name"
            FROM channels
            WHERE "server_id" = '${selectedServer}'`
        )).rows;
        const selectedChannel = channel_id == "none" ? channels[0].channel_id : channel_id;

        const data = {
            success: true,
            server_data,
            selectedChannel,
            selectedServer,
            channels,
        };

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