'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import pool from "./postgres";

export async function postNewUser(
    username: FormDataEntryValue | null,
    user_id: string | undefined,
    image: string | undefined,
) {
    try {
        const client = await pool.connect();

        const count = await client.query(`SELECT COUNT(*) FROM users`);
        const id = Number(count.rows[0].count);

        const result = await client.query(
            `SELECT COUNT(*) FROM users WHERE "user_id" = '${user_id}'`
        );
        const data = Number(result.rows[0].count);

        if (data == 0) {
            client.query(`
          INSERT INTO "users" ("xata_id", "user_id", "username", "icon-url")
          VALUES ('${id}', '${user_id}', '${username}', '${image}')
          `);
        }

        client.release();
        return data;
    } catch (error) {
        console.log("Could not fetch users: ", error);
        throw error;
    }
}

export const completeOnboarding = async (formData: FormData, user_id: string | undefined, image: string | undefined) => {

    if (!user_id) {
        return { message: 'No Logged In User' };
    };

    const client = await clerkClient();

    try {
        postNewUser(formData.get('userName'), user_id, image);
        const res = await client.users.updateUser(user_id, {
            publicMetadata: {
                onboardingComplete: true,
                userName: formData.get('userName'),
            },
        })
        return { message: res.publicMetadata };
    } catch (err) {
        return { error: 'There was an error updating the user metadata' };
    }
}