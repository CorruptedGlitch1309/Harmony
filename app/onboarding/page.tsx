"use client";
import { useUser } from "@clerk/nextjs";
import * as React from "react";
import { completeOnboarding } from "../lib/server_actions";
import { useRouter } from "next/navigation";

function page() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData, user?.id, user?.imageUrl);
    if (res.message) {
      await user?.reload();
      router.push("/");
    }
    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div>
      <div className="w-1/3 h-96 mt-28 bg-gray-700 text-white rounded-xl p-2.5 mx-auto">
        <div className="flex flex-col h-full">
          <h2 className="text-2xl text-center">Onboarding</h2>

          <form
            action={handleSubmit}
            className="flex flex-col justify-between grow"
          >
            <div>
              <label htmlFor="join-server-input">Username:</label>
              <div className="flex">
                <input
                  type="text"
                  name="userName"
                  className="bg-gray-400 grow p-1 rounded-md"
                />
              </div>
            </div>

            <button type="submit" className="p-1 bg-gray-500 rounded-md w-full">
              Submit
            </button>
          </form>
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
}

export default page;
