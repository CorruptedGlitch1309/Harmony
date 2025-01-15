import { SETCHANNELS, SETISLOADED, SETMESSAGES, SETSELECTEDCHANNEL, SETSELECTEDSERVER, SETSERVERS } from "./declarations";
import { channels, messages, servers } from "./types";


export function setSelectedServer(server_id: string) {
    return {
        type: SETSELECTEDSERVER,
        payload: { data: server_id }
    };
};

export function setServers(servers: servers) {
    return {
        type: SETSERVERS,
        payload: { data: servers }
    };
};

export function setChannels(channels: channels) {
    return {
        type: SETCHANNELS,
        payload: { data: channels }
    };
};

export function setSelectedChannel(channel: string) {
    return {
        type: SETSELECTEDCHANNEL,
        payload: { data: channel }
    };
};

export function setIsLoaded(value: boolean) {
    return {
        type: SETISLOADED,
        payload: { data: value }
    };
};

export function setMessages(messages: messages) {
    return {
        type: SETMESSAGES,
        payload: { data: messages }
    };
};