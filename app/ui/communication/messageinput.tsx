import { postMessage } from "@/app/lib/data";
import { state } from "@/app/lib/redux/types";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSWRConfig } from "swr";

function MessageInput() {
  const { user } = useUser();
  const selectedChannel = useSelector((state: state) => state.selectedChannel);

  useEffect(() => {
    const textareaEle = document.getElementById("message-input");
    if (textareaEle == null) return;

    textareaEle.addEventListener("input", () => {
      textareaEle.style.height = "auto";
      textareaEle.style.height = `${textareaEle.scrollHeight / 1.55}px`;
    });
  });

  return (
    <div className="w-full min-h-12 px-5 pt flex align-middle">
      <textarea
        id="message-input"
        typeof="text"
        className="bg-gray-200 w-full h-10 p-2 rounded-md"
        onKeyDown={(e) => {
          const input = document.getElementById(
            "message-input"
          ) as HTMLTextAreaElement;
          const message = input.value;

          if (
            e.key != "Enter" ||
            e.shiftKey ||
            selectedChannel == "none" ||
            message == ""
          )
            return setTimeout(() => (input.value = ""), 10);

          postMessage({
            user_id: user?.id,
            channel_id: selectedChannel,
            message: message,
          });

          setTimeout(() => (input.value = ""), 10);
        }}
      />
    </div>
  );
}

export default MessageInput;
