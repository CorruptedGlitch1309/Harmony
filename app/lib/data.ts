import useSWR from "swr";

export async function fetcher(
    { url, payload, method = "PUT" }:
        { url: string, payload: any, method: string | undefined }) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        console.log("Fetcher fail: ", error);
        throw error;
    };
}

export async function createServer(
    user_id: string | undefined, server_name: string | undefined, channel_name: string | undefined
) {
    const url = "/api/createServer";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, server_name, channel_name }),
        });
        return await response.json();
    } catch (error) {
        console.log("Could not post server on api: ", error);
        throw error;
    };
};

export async function postMessage(payload:
    { user_id: string | undefined, channel_id: string, message: string }) {
    const url = "/api/postMessage";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        console.log("Could not post message on api: ", error);
        throw error;
    };
};

export async function fetchUsers() {
    const url = "/api/users";
    try {
        const response = await fetch(url, {
            method: "PUT",
            // headers: {
            //     "Content-Type": "application/json",
            // },
            // body: JSON.stringify(user),
        });
        return await response.json();
    } catch (error) {
        console.log("Could not fetch users from API: ", error);
        throw error;
    };
};

export function channelsData(
    selectedServer: string,
) {
    const { data, isLoading } = useSWR(
        { url: "/api/channels", payload: selectedServer },
        fetcher
    );

    return {
        channelsArray: data,
        channelsLoading: isLoading,
    }
}