import { SETCHANNELS, SETISLOADED, SETMESSAGES, SETSELECTEDCHANNEL, SETSELECTEDSERVER, SETSERVERS } from "./declarations";
import { initialState } from "./initialState";
import { hook } from "./types";

function getCurrentServer(selectedServer: string, servers: Array<any>) {
    if (selectedServer == "none" || servers.length == 0) return { name: "" };
    return servers.filter(server => selectedServer == server.server_id)[0]
}

function getCurrentChannel(selectedChannel: string, channels: Array<any>) {
    if (selectedChannel == "none" || channels.length == 0) return { channel_name: "" }
    return channels.filter(channel => selectedChannel == channel.channel_id)[0]
}

export default function reducer(state = initialState, action: hook) {
    const newState = (newState: any) => Object.assign({}, state, newState);

    switch (action.type) {
        case SETSELECTEDSERVER:
            return Object.assign({}, state, {
                selectedServer: action.payload.data,
                selectedServerInfo: getCurrentServer(action.payload.data, state.servers)
            })
            break;
        case SETSERVERS:
            return newState({ servers: action.payload.data });
            break;
        case SETCHANNELS:
            return newState({ channels: action.payload.data });
            break;
        case SETSELECTEDCHANNEL:
            return Object.assign({}, state, {
                selectedChannel: action.payload.data,
                selectedChannelInfo: getCurrentChannel(action.payload.data, state.channels)
            })
        case SETISLOADED:
            return newState({ isLoaded: action.payload.data });
            break;
        case SETMESSAGES:
            return newState({ messages: action.payload.data });
            break;
        default: return state;
    }
}