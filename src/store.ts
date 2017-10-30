import Player from './model/player';

class Store {
    public score: number = 0;
    public remotePlayers: Map<string, Player>;
    public localPlayer: Player;
    public deltaTime: number;
    constructor() {
        this.remotePlayers = new Map<string, Player>();
    }
}

export const store = new Store();