import { fetcher } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

function MessageContainer() {
  const selectedChannel = useSelector((state: state) => state.selectedChannel);
  const { data, error, isLoading, mutate } = useSWR(
    {
      url: "/api/messages",
      payload: selectedChannel,
    },
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (isLoading) return;
    const div = document.getElementById("scrolling");
    div?.scrollTo({ top: div?.scrollHeight });
  });

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div id="scrolling" className="grow overflow-y-auto no-anchor px-1">
      <div className="h-full" />
      {...data.map((message: any) => {
        return (
          <div className="w-full flex">
            <img
              className="w-10 h-10 rounded-full mr-2"
              src={message["icon-url"]}
              alt=""
            />
            <div>
              <span className="font-bold block w-full">{message.username}</span>
              <span>{message.message}</span>
            </div>
          </div>
        );
      })}
      <div className="anchor"></div>
    </div>
  );
}

export default MessageContainer;
