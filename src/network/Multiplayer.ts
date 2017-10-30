class Multiplayer {
    public lastReceivedTick = 0;
    public currentTick = 0;
    public commands = [[]];
    public animationInterval;
    public tickLoop: number;
}

export const multiplayer = new Multiplayer();