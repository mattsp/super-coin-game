import { store } from './../store';
import { Colorutils } from './../utils/utils';
import * as Assets from '../assets';

export default class Multiplayer extends Phaser.State {

    private _playerColor1: string;
    private _playerColor2: string;
    private _playerName1: string;
    private _playerName2: string;

    public create(): void {
        const background = this.game.add.image(0, 0, Assets.Images.ImagesBackground.getName());
        background.scale.setTo(1.6, 1.5);

        store.isMultiPlayerMode = true;

        const player1Label = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 - 50,
            'Player 1: ',
            { font: 'bold 40px Arial', fill: '#fff' });
        player1Label.anchor.setTo(0.5, 0.5);

        this._playerColor1 = Colorutils.getRandomColor();
        this._playerColor2 = Colorutils.getRandomColor();
        this._playerName1 = prompt('Please enter your name', 'Player 1') || 'Player 1';
        this._playerName2 = prompt('Please enter your name', 'Player 2') || 'Player 2';
        const player1NameLabel = this.game.add.text(this.game.world.width / 2, (this.game.world.height / 2) - 50 + 50,
            this._playerName1,
            { font: ' 40px Arial', fill: this._playerColor1 });
        player1NameLabel.anchor.setTo(0.5);

        const player2Label = this.game.add.text(this.game.world.width / 2, (this.game.world.height / 2) - 50 + 100,
            'Player 2: ',
            { font: 'bold 40px Arial', fill: '#fff' });
        player2Label.anchor.setTo(0.5, 0.5);

        const player2NameLabel = this.game.add.text(this.game.world.width / 2, (this.game.world.height / 2) - 50 + 150,
            this._playerName2,
            { font: '40px Arial', fill: this._playerColor2 });
        player2NameLabel.anchor.setTo(0.5);

        const newGame = this.game.add.sprite(this.game.world.width / 2, this.game.world.height - 80, Assets.Images.ImagesBtn.getName());
        newGame.anchor.setTo(0.5, 0.5);
        newGame.width = 200;
        newGame.height = 50;
        newGame.tint = 0.3 * 0xffffff;
        const newGameLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height - 80,
            'Start Game',
            { font: '12px Arial', fill: '#ffffff' });
        newGameLabel.anchor.setTo(0.5, 0.5);
        newGameLabel.scale.setTo(1.6, 1.5);

        this.game.add.tween(newGameLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 1000)
            .to({ angle: 0 }, 500).loop().start();

        newGame.inputEnabled = true;
        newGame.events.onInputDown.add(this._startGame, this);
    }

    private _startGame(): void {
        this.game.state.start('game', true, false, {
            isMultiPlayerMode: true,
            playerColor1: this._playerColor1,
            playerColor2: this._playerColor2,
            playerName1: this._playerName1,
            playerName2: this._playerName2
        });
    }
}