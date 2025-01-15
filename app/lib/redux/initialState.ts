import { state } from "./types";


export const initialState: state = {
    selectedServer: "none",
    selectedServerInfo: {
        name: "",
    },
    selectedChannelInfo: {
        name: "",
    },
    servers: [],
    channels: [],
    selectedChannel: 'none',
    isLoaded: false,
    messages: [],
}