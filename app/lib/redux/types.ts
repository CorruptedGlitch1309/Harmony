

export type hook = {
    type: string;
    payload: { data: any };
}

export type servers = Array<{ server_id: string, name: string, "icon-url": string }>
export type channels = Array<{ channel_name: string, channel_id: string }>
export type messages = Array<{ user_id: string, message: string }>

export type state = {
    selectedServer: string;
    selectedServerInfo: any;
    selectedChannelInfo: any;
    servers: servers;
    isLoaded: boolean;
    channels: channels;
    selectedChannel: string;
    messages: messages;
}