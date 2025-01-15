import Image from "next/image";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannels,
  setSelectedChannel,
  setSelectedServer,
  setServers,
} from "@/app/lib/redux/hooks";
import { state } from "@/app/lib/redux/types";

function ServerList(props: { openDialog: Function }) {
  const dispatch = useDispatch();
  const servers = useSelector((state: state) => state.servers);
  const selectedServer = useSelector((state: state) => state.selectedServer);

  return (
    <div className="bg-gray-500 h-screen w-1/3 flex flex-col py-4">
      <div className="flex flex-col">
        {servers.length == 0 ? (
          <></>
        ) : (
          [...servers].map(
            (server: {
              server_id: string;
              "icon-url": string;
              name: string;
            }) => {
              return (
                <div
                  id={server.name}
                  key={server.server_id}
                  className={clsx("relative w-full h-full server", {
                    "selected-server": server.server_id == selectedServer,
                  })}
                >
                  <div className="p-2 flex justify-center">
                    <button
                      className="rounded-3xl h-12 w-12"
                      onClick={() => {
                        dispatch(setSelectedServer(server.server_id));
                        dispatch(setSelectedChannel("none"));
                        dispatch(setChannels([]));
                      }}
                    >
                      <Image
                        className="rounded-3xl is-server"
                        id={`${server.server_id}`}
                        src={server["icon-url"]}
                        width={500}
                        height={500}
                        alt={server.name}
                      />
                    </button>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
      <button
        className="text-white bg-black text-5xl text-center h-12 w-12 mt-2 rounded-2xl mx-auto"
        onClick={() => props.openDialog("AddServer")}
      >
        +
      </button>
    </div>
  );
}

export default ServerList;
