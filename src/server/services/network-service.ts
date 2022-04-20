import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { GlobalEvents as Events } from "shared/events";

@Service({})
export class NetworkService implements OnStart, OnInit {
    Connected = new Map<string, Array<Callback>>();

    //create a map that maps Players onto calls


    public Connect(eventName: string, callback: Callback){
        let existingConnection = this.Connected.get(eventName) as Array<Callback>;
        let index: number;
        if(existingConnection === undefined){
            index = 0;
            existingConnection = [callback];
            this.Connected.set(eventName, existingConnection);
        } else {
            // note for future, can use .size() to get the (length + 1) of the array
            index = existingConnection.size();
            existingConnection[index] = callback;
        };
        return {
            Disconnect: () => {
                existingConnection.remove(index);
            }
        };
    };

    public Send(plr: Player, eventName: string , ...args: unknown[]){
        Events.server.serverToClient.fire(plr, eventName, ...args);
    }

    public Broadcast(eventName: string, ...args: unknown[]){
        Events.server.serverToClient.broadcast(eventName, ...args);
    };

    onInit() {
    }

    onStart() {
/*         while (true) {
            task.wait(1);
            this.Broadcast('test', 1, 2, 3);
        } */

        Events.server.network.connect((plr: Player, eventName: string, args:unknown[]) => {

            let connections = this.Connected.get(eventName) as Array<Callback>;
            if(connections === undefined) {
                warn('No connections for event ' + eventName);
                return;
            };
            for (const callback of connections){
                callback(plr, ...args);
            }
        });
    }
}