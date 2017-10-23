import * as Assets from '../assets';

export default class LiveBuilder extends Phaser.Group {
    private _maxLive: number;
    private _liveAvailable: number;

    constructor(game: Phaser.Game, x: number, y: number, maxLive: number) {
        super(game);
        this._maxLive = maxLive;
        this._liveAvailable = maxLive;
        this.createMultiple(maxLive, Assets.Images.ImagesLive.getName());
        this.getAll().map((live: Phaser.Sprite, index) => {
            live.anchor.setTo(1, 0);
            live.reset(x + (index * 30), y);
        });

    }

    public removeLive(): void {
        const live: Phaser.Sprite = this.getFirstAlive();
        if (live) {
            live.kill();
            this._liveAvailable--;
        }
    }

    public lives(): number {
        return this._liveAvailable;
    }
}