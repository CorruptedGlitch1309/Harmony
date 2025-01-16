import { createServer, fetcher } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import { requestMainData } from "@/app/lib/SWR/requests";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";

function CreateChannel(props: { open: boolean; setDialog: Function }) {
  const { user } = useUser();
  const selectedServer = useSelector((state: state) => state.selectedServer);
  const selectedChannel = useSelector((state: state) => state.selectedChannel);

  const { mutateMain } = requestMainData({
    user: user?.id,
    selectedServer: selectedServer,
    selectedChannel: selectedChannel,
  });

  async function handlePost(key: {
    url: string;
    payload: any;
    method: string | undefined;
  }) {
    await fetcher(key);
    mutateMain();
  }

  return (
    <dialog
      className="w-1/3 h-96 mt-28 bg-gray-700 text-white rounded-xl p-2.5"
      open={props.open}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-2xl text-center">Create Channel</h2>

        <div className="flex flex-col justify-between grow">
          <div>
            <div>
              <label htmlFor="name-input">Channel Name:</label>
              <input
                type="text"
                id="name-input"
                className="bg-gray-400 w-full p-1 rounded-md block"
                max={50}
              />
            </div>

            <button
              className="p-1 bg-gray-500 rounded-md w-full mt-3"
              onClick={() => {
                const name_input = document.getElementById(
                  "name-input"
                ) as HTMLInputElement;
                if (name_input.value == "") {
                  alert("Please enter a name!");
                  return;
                }

                handlePost({
                  url: "/api/createChannel",
                  payload: {
                    server_id: selectedServer,
                    channel_name: name_input.value,
                  },
                  method: "POST",
                });

                name_input.value = "";
                props.setDialog(false);
              }}
            >
              Create Channel
            </button>
          </div>

          <button
            className="p-1 bg-gray-500 rounded-md w-full"
            onClick={() => props.setDialog(false)}
          >
            Cancle
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default CreateChannel;
