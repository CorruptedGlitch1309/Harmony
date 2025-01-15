"use client";
import { SignedIn, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { fetchUsers } from "../lib/data";

async function getUserList(setUserList: Function) {
  const users = await fetchUsers();
  setUserList(users);
}

function page() {
  const [userList, setUserList] = useState([]);

  const { isLoaded, isSignedIn, user } = useUser();
  const username = user?.publicMetadata.userName;

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div>
      <h1>dashboard</h1>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
      <p>{user.id}</p>

      <button onClick={() => getUserList(setUserList)}>Query users</button>
      <p>{JSON.stringify(userList)}</p>
    </div>
  );
}

export default page;
