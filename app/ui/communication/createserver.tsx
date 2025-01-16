import { fetcher } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import { requestMainData } from "@/app/lib/SWR/requests";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";

function CreateServer(props: { open: boolean; setDialog: Function }) {
  const { user } = useUser();

  const selectedServer = useSelector((state: state) => state.selectedServer);
  const selectedChannel = useSelector((state: state) => state.selectedChannel);

  const { mutateMain } = requestMainData({
    user: user?.id,
    selectedServer: selectedServer,
    selectedChannel: selectedChannel,
  });

  async function createServer(server_name: string, channel_name: string) {
    await fetcher({
      url: "/api/createServer",
      payload: { user_id: user?.id, server_name, channel_name },
      method: "POST",
    });
    mutateMain;
  }

  return (
    <dialog
      className="w-1/3 h-96 mt-28 bg-gray-700 text-white rounded-xl p-2.5"
      open={props.open}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-2xl text-center">Create Server</h2>

        <div className="flex flex-col justify-between grow">
          <div>
            <div>
              <label htmlFor="name-server-input">Name:</label>
              <input
                type="text"
                id="name-server-input"
                className="bg-gray-400 w-full p-1 rounded-md block"
                max={50}
              />
            </div>

            <div className="mt-2">
              <label htmlFor="channel-server-input">Main Channel Name:</label>
              <input
                type="text"
                id="channel-server-input"
                className="bg-gray-400 w-full p-1 rounded-md block"
                max={50}
              />
            </div>

            <button
              className="p-1 bg-gray-500 rounded-md w-full mt-3"
              onClick={() => {
                const server_input = document.getElementById(
                  "name-server-input"
                ) as HTMLInputElement;
                const channel_input = document.getElementById(
                  "channel-server-input"
                ) as HTMLInputElement;
                if (server_input.value == "") {
                  alert("Please enter a name!");
                  return;
                }
                createServer(server_input.value, channel_input.value);
                server_input.value = "";
                props.setDialog("none");
              }}
            >
              Create Server
            </button>
          </div>

          <button
            className="p-1 bg-gray-500 rounded-md w-full"
            onClick={() => props.setDialog("none")}
          >
            Cancle
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default CreateServer;
