import { Networking } from "@flamework/networking";

interface ServerEvents {
    network(eventName: string, ...args:any): void;
}

interface ClientEvents {
    serverToClient(eventName: string, ...args:any): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
