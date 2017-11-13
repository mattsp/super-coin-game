import { Player } from './model/player';

class Store {
    public score: number = 0;
    public players: Map<string, Player>;
    public deltaTime: number;
    constructor() {
        this.players = new Map<string, Player>();
    }
}

export const store = new Store();