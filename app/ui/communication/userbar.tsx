import { fetcher } from "@/app/lib/data";
import { UserButton, useUser } from "@clerk/nextjs";
import useSWR from "swr";

function UserBar() {
  const { user } = useUser();
  const { data, isLoading } = useSWR(
    { url: "/api/user", payload: user?.id },
    fetcher
  );
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-9 h-9",
    },
  };

  if (isLoading) return <div className="bg-gray-500 w-full h-12" />;

  return (
    <div className="bg-gray-500 w-full h-12 flex overflow-hidden items-end py-1.5">
      <UserButton appearance={userButtonAppearance} />
      <span>{data == undefined ? "" : data.username}</span>
    </div>
  );
}

export default UserBar;
