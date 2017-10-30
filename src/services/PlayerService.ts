import { store } from '../store';
import Player from '../model/player';
import PlayerBuilder from '../builder/PlayerBuilder';

class PlayerService {
    private remotePlayers: Map<string, PlayerBuilder>;
    private localePlayer: PlayerBuilder;

    constructor() {
        this.remotePlayers = new Map<string, PlayerBuilder>();
    }

    public getFromStoreById(id: string): Player {
        return store.remotePlayers.get(id);
    }

    public getAll(): IterableIterator<PlayerBuilder> {
        return this.remotePlayers.values();
    }

    public getById(id: string, callback: (player: PlayerBuilder) => void) {
        const player = this.remotePlayers.get(id);
        if (player) {
            callback(player);
        } else {
            console.log('player', id, 'not found');
        }
    }

    public delete(id: string): PlayerBuilder {
        const playerRemoved = this.remotePlayers.get(id);
        this.remotePlayers.delete(id);
        return playerRemoved;
    }

    public save(player: PlayerBuilder): void {
        this.remotePlayers.set(player.getID(), player);
    }
}

export const playerService = new PlayerService();