import { fetcher } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import { requestMainData } from "@/app/lib/SWR/requests";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";

function AddServer(props: { open: boolean; setDialog: Function }) {
  const { user } = useUser();

  const selectedServer = useSelector((state: state) => state.selectedServer);
  const selectedChannel = useSelector((state: state) => state.selectedChannel);

  const { mutateMain } = requestMainData({
    user: user?.id,
    selectedServer: selectedServer,
    selectedChannel: selectedChannel,
  });

  async function joinServer(input: string) {
    await fetcher({
      url: "/api/joinServer",
      payload: { user_id: user?.id, server_id: input },
      method: "PUT",
    });
    mutateMain();
  }

  return (
    <dialog
      className="w-1/3 h-96 mt-28 bg-gray-700 text-white rounded-xl p-2.5"
      open={props.open}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-2xl text-center">Add Server</h2>

        <div className="flex flex-col justify-between grow">
          <div>
            <label htmlFor="join-server-input">Join Code:</label>
            <div className="flex">
              <input
                type="text"
                id="join-server-input"
                className="bg-gray-400 grow p-1 rounded-l-md"
              />
              <button
                className="p-1 bg-gray-500 rounded-r-md"
                onClick={() => {
                  const input = document.getElementById(
                    "join-server-input"
                  ) as HTMLInputElement;

                  joinServer(input.value);
                  input.value = "";
                  props.setDialog("none");
                }}
              >
                Join
              </button>
            </div>

            <div className="mt-3 mb-3 flex items-center">
              <hr className="grow"></hr>
              <span className="mx-2">Or</span>
              <hr className="grow"></hr>
            </div>

            <button
              className="p-1 bg-gray-500 rounded-md w-full"
              onClick={() => props.setDialog("CreateServer")}
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

export default AddServer;
