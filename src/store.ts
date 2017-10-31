import PlayerBuilder from './builder/PlayerBuilder';

class Store {
    public scorePlayer1: number = 0;
    public scorePlayer2: number = 0;
    public isMultiPlayerMode: boolean = false;
}

export const store = new Store();