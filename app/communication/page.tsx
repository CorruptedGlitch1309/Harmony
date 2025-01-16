"use client";

import MessageContainer from "../ui/communication/messagecontainer";
import MessageInput from "../ui/communication/messageinput";
import ChannelList from "../ui/communication/channellist";
import ServerList from "../ui/communication/serverlist";
import AddServer from "../ui/communication/addserver";
import { useEffect, useState } from "react";
import CreateServer from "../ui/communication/createserver";
import { fetcher } from "../lib/data";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { state } from "../lib/redux/types";
import {
  setChannels,
  setSelectedChannel,
  setSelectedServer,
  setServers,
} from "../lib/redux/hooks";
import useSWR from "swr";
import Menu from "../ui/communication/menu";
import { requestMainData } from "../lib/SWR/requests";

function page() {
  const { user } = useUser();
  const [selectedDialog, setDialog] = useState("none");
  const [windowExists, setWindowExists] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clickedServer, setClickedServer] = useState("none");

  const dispatch = useDispatch();
  const selectedServer = useSelector((state: state) => state.selectedServer);
  const selectedChannel = useSelector((state: state) => state.selectedChannel);
  const selectedChannelInfo = useSelector(
    (state: state) => state.selectedChannelInfo
  );

  const { data, isLoading, mutateMain } = requestMainData({
    user: user?.id,
    selectedServer: selectedServer,
    selectedChannel: selectedChannel,
  });

  const { mutate } = useSWR(
    {
      url: "/api/data",
      payload: {
        user_id: user?.id,
        server_id: selectedServer,
        channel_id: selectedChannel,
      },
    },
    fetcher
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!windowExists) {
        window.addEventListener(
          "contextmenu",
          (e) => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            const menu = document.getElementById("menu") as HTMLElement;

            if (!target.classList.value.includes("is-server")) {
              setMenuOpen(false);
              setClickedServer("none");
              return;
            }

            const server_id = target.id;
            setClickedServer(server_id);

            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;

            setMenuOpen(true);
          },
          false
        );

        window.addEventListener("click", (e) => {
          setMenuOpen(false);
          setClickedServer("none");
        });
        setWindowExists(true);
      }
    }

    if (!isLoading && user?.id) {
      if (!data.success) return;
      dispatch(setServers(data.server_data));
      dispatch(setSelectedServer(data.selectedServer));
      dispatch(setChannels(data.channels));
      dispatch(setSelectedChannel(data.selectedChannel));
    }
  });

  return (
    <div className="fixed w-screen h-screen flex flex-row">
      <div className="w-4/12 max-w-60 flex">
        <ServerList openDialog={setDialog} />
        <ChannelList />
      </div>

      <div className="w-full h-screen flex flex-col justify-between">
        <div className="bg-gray-400 h-6 w-full px-2">
          {!selectedChannelInfo ? "" : selectedChannelInfo.channel_name}
        </div>
        <MessageContainer />
        <MessageInput />
      </div>

      {selectedDialog == "AddServer" ? (
        <AddServer open={true} setDialog={setDialog} />
      ) : selectedDialog === "CreateServer" ? (
        <CreateServer open={true} setDialog={setDialog} />
      ) : (
        <></>
      )}

      <Menu menuOpen={menuOpen} server_id={clickedServer} />
    </div>
  );
}

export default page;
