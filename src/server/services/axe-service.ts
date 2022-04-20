import { Service, OnStart, OnInit } from "@flamework/core";
import { NetworkService } from "./network-service";
import { RoundService } from "./round-service";

@Service({})
export class AxeService implements OnStart, OnInit {
    constructor(private NetworkService: NetworkService, private RoundService: RoundService) {}


    onInit() {
        
    }

    private subtractAttribute(object: Instance, attribute: string , amount: number, callbackWhenZero: Callback){
        let currentValue = object.GetAttribute(attribute) as number;
        
        if (currentValue === 0) {
            callbackWhenZero();
            return;
        }

        if(currentValue === 0) return;

        let newValue = currentValue - amount;

        if(newValue < 0){
            newValue = 0;
            callbackWhenZero();
        }

        object.SetAttribute(attribute, newValue);
    }

    onStart() {
        this.NetworkService.Connect('axe-activated', (plr: Player) => {
            const char = plr.Character as Model;
            const axe = char.FindFirstChild('Axe');

            if(axe === undefined) return;

            const axeHandle = axe.FindFirstChild('Handle') as BasePart;
            const swingTrail = axeHandle.FindFirstChild('SlashTrail') as Trail;

            swingTrail.Enabled = true;
            task.delay(0.25, () => {
                swingTrail.Enabled = false;
            })
        });

        this.NetworkService.Connect('axe-hit', (plr: Player, hit: BasePart) => {
            const char = plr.Character as Model;
            const axe = char.FindFirstChild('Axe');

            if (plr.DistanceFromCharacter(hit.Position) > 8) return;

            if(axe === undefined) return;

            const TreeModel = hit.FindFirstAncestor('Pine Tree') as Model;
            if (!TreeModel) return;

            this.subtractAttribute(TreeModel, 'Health', math.random(10, 15), () => {
                TreeModel.Destroy();
                if (!plr.GetAttribute('DestroyedTrees')){plr.SetAttribute('DestroyedTrees', 0)};
                let currentValue = this.RoundService.TreesCut.get(plr);
                if(currentValue === undefined){
                    currentValue = 0;
                };

                this.RoundService.TreesCut.set(plr, currentValue + 1);
                this.NetworkService.Send(plr, 'SetTrees', this.RoundService.TreesCut.get(plr));
            });
        })
    }
}