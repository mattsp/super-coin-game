import { store } from './../store';
export default class ScoreBuilder extends Phaser.Text {
    private _value: number = 0;
    constructor(game: Phaser.Game, x: number, y: number, key: string = '', text: string) {
        super(game, x, y, key);
        this.text = text + ': ' + this._value;
        this.font = '18px arial';
        this.fill = '#ffffff';
        game.add.existing(this);
    }

    public add(value: number): void {
        this._value += value;
        this.text = this.text.replace(new RegExp(/\:(.*)/g), ': ' + this._value);
    }
}