import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/app/lib/postgres';

async function createServer(
    { user_id, server_name, channel_name }:
        { user_id: string, server_name: string, channel_name: string }) {
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

        const server_id = await random_id("server");
        const server_xata_id = (await client.query(`SELECT COUNT(*) FROM "servers"`)).rows[0].count;
        const channel_id = await random_id("channel");
        const channel_xata_id = (await client.query(`SELECT COUNT(*) FROM "channels"`)).rows[0].count;

        const servers = (await client.query(
            `SELECT "servers" FROM "users" WHERE user_id = '${user_id}'`
        )).rows[0].servers.servers;

        const newServers = [...servers, server_id];

        client.query(
            `UPDATE "users"
            SET "servers" = '{ "servers": ${JSON.stringify(newServers)}}'
            WHERE "user_id" = '${user_id}'`
        );

        client.query(
            `INSERT INTO
                "servers" (
                "xata_id",
                "icon-url",
                "name",
                "owner",
                "server_id"
            ) 
            VALUES
            (
                '${server_xata_id}',
                '/folder.png',
                '${server_name}',
                '${user_id}',
                '${server_id}'
            );`
        );

        client.query(
            `INSERT INTO
            "channels" ("xata_id", "channel_name", "server_id", "channel_id")
            VALUES
            ('${channel_xata_id}', '${channel_name}', '${server_id}', '${channel_id}');
            `);

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
    const data = await createServer(req.body);
    res.status(200).json(data);
}