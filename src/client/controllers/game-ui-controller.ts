import { Controller, OnStart, OnInit } from "@flamework/core";
import { NetworkController } from "./network-controller";
import {Players} from "@rbxts/services";

let localPlayer = Players.LocalPlayer;

let gameGUI = (localPlayer.FindFirstChild('PlayerGui') as PlayerGui).WaitForChild('GameGUI');
let infoLabel = gameGUI.WaitForChild('InfoLabel') as TextLabel;
let treeCountLabel = gameGUI.WaitForChild('TreeCountLabel') as TextLabel;

@Controller({})
export class GameUIController implements OnStart, OnInit {
    constructor(private readonly Network: NetworkController){}
    
    onInit() {
        
    }

    onStart() {
        this.Network.Connect('SetTrees', (treeCount: number) => {
            treeCountLabel.Text = string.format('[🌲]: %d', treeCount);
        });

        this.Network.Connect('SetInfo', (info: string) => {
            infoLabel.Text = info;
        })
    }
}