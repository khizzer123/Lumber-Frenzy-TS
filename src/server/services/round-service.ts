import { Service, OnStart, OnInit } from "@flamework/core";
import { NetworkService } from "./network-service";
import { TreeGenerationService } from "./tree-generation-service";

@Service({})
export class RoundService implements OnStart, OnInit {
    constructor(private Network: NetworkService, private TreeGenerationService: TreeGenerationService) {}

    TreesCut: Map<Player, number> = new Map();

    private Intermission() {
        for (let i = 15; i > 0; i--) {
            task.wait(1);
            this.Network.Broadcast('SetInfo', 'Intermission: ' + i);
        }
        this.TreeGenerationService.generateTrees(30);
    };

    private GetWinner() {
        let winner = 'Nobody';
        let winnerScore = 0;

        for (const [plr, score] of this.TreesCut) {
            if (score > winnerScore) {
                winner = plr.Name;
                winnerScore = score;
            }
        }

        return winner;
    }

    public SetPlayerStats(plr: Player, score: number) {
        this.TreesCut.set(plr, score);
    }

    private StartRound() {
        for (let i = 30; i > 0; i--) {
            task.wait(1);
            this.Network.Broadcast('SetInfo', 'Remaining Time: ' + i);
        };

        this.TreeGenerationService.removeTrees();
        this.Network.Broadcast('SetInfo', 'Round Over!');
        this.Network.Broadcast('SetTrees', 0);

        task.wait(2);

        this.Network.Broadcast('SetInfo', 'Round over! The winner was...');
        task.wait(2);
        const winner = this.GetWinner();
        print(winner);
        this.Network.Broadcast('SetInfo', '... ' + winner);

        this.TreesCut.clear();
    }

    onInit() {
        
    }

    onStart() {
        while (true) {
            this.Intermission();
            this.StartRound();
        }
    }
}