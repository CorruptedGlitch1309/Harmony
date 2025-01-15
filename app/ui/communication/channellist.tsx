import { setChannels, setSelectedChannel } from "@/app/lib/redux/hooks";
import { state } from "@/app/lib/redux/types";
import { useDispatch, useSelector } from "react-redux";
import CreateChannel from "./createchannel";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { channelsData, fetcher } from "@/app/lib/data";
import UserBar from "./userbar";
import { useUser } from "@clerk/nextjs";

const ChannelList = (props: { mutate: Function }) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const selectedServerInfo = useSelector(
    (state: state) => state.selectedServerInfo
  );
  const selectedServer = useSelector((state: state) => state.selectedServer);
  const channels = useSelector((state: state) => state.channels);
  const [createChannel, setCreateChannel] = useState(false);

  return (
    <>
      <div className="bg-gray-400 h-screen w-2/3 flex flex-col justify-between">
        <div className="flex flex-col items-start">
          <div className="h-8 w-full border-r border-b border-l flex items-center">
            <span className="text">
              {selectedServer == undefined ? "" : selectedServerInfo.name}
            </span>
          </div>
          {channels.map(
            (channel: { channel_name: string; channel_id: string }) => {
              return (
                <button
                  className="px-1"
                  key={channel.channel_id}
                  onClick={() => {
                    dispatch(setSelectedChannel(channel.channel_id));
                  }}
                >
                  {channel.channel_name}
                </button>
              );
            }
          )}
        </div>
        <div>
          {selectedServerInfo.owner != user?.id ? (
            <></>
          ) : (
            <button
              className=" bg-gray-600 text-lg px-2 rounded-full mx-auto mb-2 block"
              onClick={() => setCreateChannel(true)}
            >
              Create Channel
            </button>
          )}
          <UserBar />
        </div>
      </div>
      <CreateChannel
        open={createChannel}
        setDialog={setCreateChannel}
        mutate={props.mutate}
      />
    </>
  );
};

export default ChannelList;
