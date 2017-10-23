import * as Assets from '../assets';

export default class CoinBuilder extends Phaser.Sprite {

    private _coinSound: Phaser.Sound;
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Images.ImagesCoin.getName(), 0);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this._coinSound = this.game.add.audio(Assets.Audio.AudioCoin.getName());
        this._scaleCoin();
        game.add.existing(this);
    }

    private _scaleCoin() {
        this.scale.setTo(0, 0);
        this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 300).start();
    }

    public updatePosition(): void {

        const coinPosition = [
            { x: 224, y: 90 }, { x: 576, y: 90 }, // Top row
            { x: 96, y: 210 }, { x: 704, y: 210 }, // Middle row
            { x: 208, y: 420 }, { x: 592, y: 420 }]; // Bottom row

        for (let i = 0, count = coinPosition.length; i < count; i++) {
            if (coinPosition[i].x === this.x) {
                coinPosition.splice(i, 1);
                break;
            }
        }
        const newPosition = this.game.rnd.pick(coinPosition);
        this._scaleCoin();
        this.reset(newPosition.x, newPosition.y);

    }

    public playSound(): void {
        this._coinSound.play();
    }
}