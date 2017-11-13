import { store } from '../store';
import { Player } from '../model/player';
import PlayerBuilder from '../builder/PlayerBuilder';

class PlayerService {
    private players: Map<string, PlayerBuilder>;

    constructor() {
        this.players = new Map<string, PlayerBuilder>();
    }

    public getFromStoreById(id: string): Player {
        return store.players.get(id);
    }

    public getAll(): IterableIterator<PlayerBuilder> {
        return this.players.values();
    }

    public getById(id: string, callback: (player: PlayerBuilder) => void) {
        const player = this.players.get(id);
        if (player) {
            callback(player);
        } else {
            console.log('player', id, 'not found');
        }
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