"use server";
import { SignInButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import pool from "./lib/postgres";

async function postNewUser(
  email: string | undefined,
  user_id: string | undefined
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
        INSERT INTO "users" ("xata_id", "email", "user_id")
        VALUES ('${id}', '${email}', '${user_id}')
        `);
    }

    client.release();
    return data;
  } catch (error) {
    console.log("Could not fetch users: ", error);
    throw error;
  }
}

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();
  postNewUser(user?.primaryEmailAddress?.emailAddress, user?.id);
  if (userId) {
    redirect("/communication");
  }

  return (
    <div className="p-3">
      <SignInButton>
        <div className="bg-gray-500 inline p-1 rounded-md hover:cursor-pointer">
          Sign In
        </div>
      </SignInButton>
    </div>
  );
}
