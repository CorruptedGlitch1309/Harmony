import { fetcher } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import { requestMainData } from "@/app/lib/SWR/requests";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { useSelector } from "react-redux";

function Menu(props: { menuOpen: boolean; server_id: string }) {
  const { user } = useUser();

  const selectedServer = useSelector((state: state) => state.selectedServer);
  const selectedChannel = useSelector((state: state) => state.selectedChannel);

  const { mutateMain } = requestMainData({
    user: user?.id,
    selectedServer: selectedServer,
    selectedChannel: selectedChannel,
  });

  const optionClasses = "block text-left";

  async function leaveServer() {
    await fetcher({
      url: "/api/leaveServer",
      payload: { user_id: user?.id, server_id: props.server_id },
      method: "PUT",
    });
    mutateMain();
  }

  return (
    <div
      id="menu"
      className={clsx("min-w-36 fixed bg-white rounded-md px-1.5", {
        hidden: !props.menuOpen,
      })}
    >
      <button
        className="block text-left"
        onClick={() => navigator.clipboard.writeText(props.server_id)}
      >
        Copy Server Code
      </button>
      <button
        className={optionClasses + " text-red-700 font-bold"}
        onClick={() => {
          leaveServer();
        }}
      >
        Leave Server
      </button>
    </div>
  );
}

export default Menu;
