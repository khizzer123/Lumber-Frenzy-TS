import { Service, OnStart, OnInit } from "@flamework/core";
import { NetworkService } from "./network-service";
import { ServerStorage, Workspace } from "@rbxts/services";

const treePrefab = ServerStorage["Pine Tree"];
const TreeStorage = Workspace.Trees;

@Service({})
export class TreeGenerationService implements OnStart, OnInit {
    constructor(private NetworkService: NetworkService) {

    }

    private generateTree(position: Vector3) {
        const tree = treePrefab.Clone();
        tree.Parent = TreeStorage;
        tree.PivotTo(new CFrame(position).mul(CFrame.Angles(math.rad(270), 0 , 0)));
    }

    public generateTrees(amount: number) {
        for (let i = 0; i < amount; i++) {
            const position = new Vector3(
                math.random(-100, 100),
                2,
                math.random(-100, 100)
            );

            this.generateTree(position);
        }
    }

    public removeTrees() {
        for (const tree of TreeStorage.GetChildren()) {
            tree.Destroy();
        }
    }
    
    onInit() {
        
    }

    onStart() {
    }
}