import { Player } from './model/Player';

class Store {
    public score: number = 0;
    public deltaTime: number;
    constructor() {
    }
}

export const store = new Store();