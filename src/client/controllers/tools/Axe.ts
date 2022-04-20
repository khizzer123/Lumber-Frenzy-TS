import { ToolClass } from "./tool";
import { Players } from "@rbxts/services";
import { NetworkController } from "../network-controller";
import { Dependency } from "@flamework/core";

const Network = Dependency<NetworkController>()

const LOCAL_PLAYER = Players.LocalPlayer;

export class Axe extends ToolClass {
    private Tool: unknown = undefined;
    private Humanoid: unknown = undefined;
    private Animations: unknown = undefined;
    private LeftSlash: unknown = undefined;
    private SideSlash: unknown = undefined;
    private HitConnection: unknown = undefined;
    private Cooldown = false;

    private NetworkController: unknown = undefined;

    public RegisterTool(tool: Tool): ToolClass {
        this.Tool = tool;
        this.Animations = (this.Tool as Tool).FindFirstChild('Animations') as Folder;
        this.Humanoid = LOCAL_PLAYER.Character?.WaitForChild('Humanoid') as Humanoid;

        const leftSlash = (this.Animations as Folder).FindFirstChild('LeftSlash') as Animation
        //const sideSlash = (this.Animations as Folder).FindFirstChild('SideSwipe') as Animation

        this.LeftSlash = (this.Humanoid as Humanoid).LoadAnimation(leftSlash);
        this.SideSlash = (this.Humanoid as Humanoid).LoadAnimation(leftSlash);

        
        return this;
    }


    public Equipped() {

    }

    public Unequipped() {

    }

    public Activated() {
        if (this.Cooldown === true) return;

        const handle = (this.Tool as Tool).FindFirstChild('Handle') as BasePart;

        Network.Send('axe-activated');
        
        const randomAnimation = math.random(1, 2) === 1 ? (this.LeftSlash as AnimationTrack) : (this.SideSlash as AnimationTrack);
        randomAnimation.Play();

        this.Cooldown = true;

        this.HitConnection = handle.Touched.Connect((hit: BasePart) => {
            Network.Send('axe-hit', hit);
        })

        randomAnimation.Stopped.Connect(() => {
            this.Cooldown = false;
            (this.HitConnection as RBXScriptConnection).Disconnect();
        })
    }

    public Deactivated() {

    }
}