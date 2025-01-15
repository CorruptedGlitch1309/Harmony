import { fetcher } from "@/app/lib/data";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";

function Menu(props: {
  menuOpen: boolean;
  server_id: string;
  mutate: Function;
}) {
  const { user } = useUser();
  const optionClasses = "block text-left";

  async function leaveServer() {
    await fetcher({
      url: "/api/leaveServer",
      payload: { user_id: user?.id, server_id: props.server_id },
      method: "PUT",
    });
    props.mutate();
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
