import useSWR from "swr";
import { fetcher } from "../data";

export function requestMainData(
    { user, selectedServer, selectedChannel }:
        { user: string | undefined, selectedServer: string, selectedChannel: string }
) {

    const { data, isLoading, mutate } = useSWR(
        {
            url: "/api/data",
            payload: {
                user_id: user,
                server_id: selectedServer,
                channel_id: selectedChannel,
            },
        },
        fetcher
    );

    return {
        data,
        isLoading,
        mutateMain: mutate,
    }
}

export function requestUser(user: string | undefined) {

    const { data, isLoading } = useSWR(
        { url: "/api/user", payload: user },
        fetcher
    );

    if (!user) return {
        userData: {
            username: "",
        },
        isLoading: true,
    };

    return {
        userData: data,
        isLoading,
    };
};

export function requestMessages(selectedChannel: string) {


    const { data, error, isLoading, mutate } = useSWR(
        {
            url: "/api/messages",
            payload: selectedChannel,
        },
        fetcher,
        { refreshInterval: 1000 }
    );

    return {
        messagesData: data,
        error,
        isLoading,
        mutateMessages: mutate,
    };
}