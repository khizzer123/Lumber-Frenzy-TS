import { Controller, OnStart, OnInit } from "@flamework/core";
import {Players, ContextActionService} from "@rbxts/services";
import { ToolClass } from "./tools/tool";

//toolInterface is needed because rbxtsc converts classes into {class = (the class table)}
interface toolInterface {
    [toolModule: string]: ToolClass;
}


const initiatedTools = new Map<Tool, ToolClass>()

const isInitiated = (tool: Tool) => {
    for (const toolArray of initiatedTools) {
        if (toolArray[0] === tool){
            return true;
        };
    };
};

const checkTool = (tool: Tool) => {
    if (isInitiated(tool)){
        return;
    };

    let linkedModule = tool.GetAttribute('Module') as string;
    if (!linkedModule) return;
    

    const toolModule = require(script.Parent?.FindFirstChild('tools')?.FindFirstChild(linkedModule) as ModuleScript) as toolInterface;
    
    if (!toolModule){
        warn('No tool module found');
    } else {
        const toolTable = toolModule[linkedModule] as ToolClass;

        initiatedTools.set(tool, toolTable.RegisterTool(tool));

        tool.GetPropertyChangedSignal('Parent').Connect(() => {
            if (!tool.Parent) {
                initiatedTools.delete(tool);
            }
        })

        tool.Equipped.Connect(() => {
            toolTable.Equipped();
            toolTable.IsEquipped = true;
        });

        tool.Unequipped.Connect(() => {
            toolTable.Unequipped();
            toolTable.IsEquipped = false;
        });

        tool.Activated.Connect(() => toolTable.Activated());
        tool.Deactivated.Connect(() => toolTable.Deactivated());

    }
};

@Controller({})
export class ToolController implements OnStart, OnInit {
    onInit() {
        
    }

    onStart() {
        Players.LocalPlayer.CharacterAdded.Connect((character) => {
            if (!character) {
                return;
            };
            initiatedTools.clear();
            (character.WaitForChild('Humanoid') as Humanoid).Died.Connect(() => {
                for (const toolArray of initiatedTools) {
                    if (toolArray[1].IsEquipped) {
                        toolArray[1].Unequipped();
                        toolArray[1].IsEquipped = false;
                    }
                }
            })
        })


        ContextActionService.LocalToolEquipped.Connect(checkTool);
    }
}