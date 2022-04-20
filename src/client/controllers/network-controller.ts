import { Controller, OnStart, OnInit } from "@flamework/core";
import { GlobalEvents as Events} from "shared/events";

@Controller({})
export class NetworkController implements OnStart, OnInit {

    Connected = new Map<string, Array<Callback>>();

    Send(eventName: string, ...args: any) {
        let tableToSend = [];
        for (const arg of args) {
            tableToSend.push(arg);
        }
        Events.client.network.fire(eventName, tableToSend);
    }

    public Connect(eventName: string, callback: Callback){
        let existingConnection = this.Connected.get(eventName) as Array<Callback>;
        let index: number;
        if (existingConnection === undefined) {
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
    }


    onInit() {
        
    }

    onStart() {
        Events.client.serverToClient.connect((eventName, ...args) => {
            let connections = this.Connected.get(eventName) as Array<Callback>;
            if (connections === undefined) {
                warn('No connections for event ' + eventName);
                return;
            };
            for (const callback of connections){
                callback(...args);
            };
        });

/*         this.Connect('test', (...args: unknown[]) => {
            print(...args);
        }) */
    };
}