import { fetcher } from "@/app/lib/data";
import { requestUser } from "@/app/lib/SWR/requests";
import { UserButton, useUser } from "@clerk/nextjs";
import useSWR from "swr";

function UserBar() {
  const { user } = useUser();
  const { userData, isLoading } = requestUser(user?.id);

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-9 h-9",
    },
  };

  return (
    <div className="bg-gray-500 w-full h-12 flex overflow-hidden items-end py-1.5">
      <UserButton appearance={userButtonAppearance} />
      <span>{isLoading ? "" : userData.username}</span>
    </div>
  );
}

export default UserBar;
