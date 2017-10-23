export default class ScoreBuilder extends Phaser.Text {
    private _value: number = 0;
    constructor(game: Phaser.Game, x: number, y: number, key: string = '') {
        super(game, x, y, key);
        this.text = 'score: ' + this._value;
        this.font = '18px arial';
        this.fill = '#ffffff';
        game.add.existing(this);
    }

    public add(value: number): void {
        this._value += value;
        this.game['global'].score = this._value;
        this.text = 'score: ' + this._value;
    }
}