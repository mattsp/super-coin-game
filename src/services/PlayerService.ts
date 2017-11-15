import { store } from '../store';
import { Player } from '../model/Player';
import PlayerBuilder from '../builder/PlayerBuilder';

class PlayerService {
    private players: Map<string, PlayerBuilder>;

    constructor() {
        this.players = new Map<string, PlayerBuilder>();
    }

    public getAll(): IterableIterator<PlayerBuilder> {
        return this.players.values();
    }

    public getById(id: string): PlayerBuilder {
        const player = this.players.get(id);
        if (!player) {
            console.log(`player ${id} not found`);
        }
        return player;
    }

    public delete(id: string): PlayerBuilder {
        const playerRemoved = this.players.get(id);
        this.players.delete(id);
        return playerRemoved;
    }

    public save(player: PlayerBuilder): void {
        this.players.set(player.getID(), player);
    }
}

export const playerService = new PlayerService();