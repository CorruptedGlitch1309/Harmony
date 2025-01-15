import { fetchMessages } from "./data";


export function getServerInfo(servers: Array<any>, server_id: string) {
    console.log(servers.filter((server) => server_id == server.server_id))
}