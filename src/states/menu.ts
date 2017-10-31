import { store } from './../store';
import * as Assets from '../assets';

export default class Menu extends Phaser.State {

    private _muteButton: Phaser.Button;

    public create(): void {
        const background = this.game.add.image(0, 0, Assets.Images.ImagesBackground.getName());
        background.scale.setTo(1.6, 1.5);

        this._muteButton = this.game.add.button(20, 20, Assets.Spritesheets.SpritesheetsMuteButton28222.getName(), this._toggleSound, this);
        this._muteButton.frame = this.game.sound.mute ? 1 : 0;
        this._muteButton.scale.setTo(1.6, 1.5);

        const nameLabel = this.game.add.text(this.game.world.width / 2, -50,
            'Super Coin Box', { font: '70px ' + Assets.CustomWebFonts.FontsGeoRegular.getFamily(), fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        nameLabel.scale.setTo(1.6, 1.5);

        this.game.add.tween(nameLabel).to({ y: 80 }, 1000)
            .easing(Phaser.Easing.Bounce.Out).start();

        this._loadBestScore();
        const scoreText = 'score: ' + Math.max(store.scorePlayer1, store.scorePlayer2) + '\nbest score: ' +
            localStorage.getItem('bestScore');

        // Show the score at the center of the screen
        const scoreLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2,
            scoreText,
            { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabel.anchor.setTo(0.5, 0.5);
        scoreLabel.scale.setTo(1.6, 1.5);


        const newGame = this.game.add.sprite(this.game.world.width / 2, this.game.world.height - 160, Assets.Images.ImagesBtn.getName());
        newGame.anchor.setTo(0.5, 0.5);
        newGame.width = 200;
        newGame.height = 50;
        newGame.tint = 0.3 * 0xffffff;
        const newGameLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height - 160,
            'New Game',
            { font: '12px Arial', fill: '#ffffff' });
        newGameLabel.anchor.setTo(0.5, 0.5);
        newGameLabel.scale.setTo(1.6, 1.5);

        this.game.add.tween(newGameLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 1000)
            .to({ angle: 0 }, 500).loop().start();

        newGame.inputEnabled = true;
        newGame.events.onInputDown.add(this._startGame, this);

        if (this.game.device.desktop === true) {
            const multiPlayerMode = this.game.add.sprite(this.game.world.width / 2, this.game.world.height - 80, Assets.Images.ImagesBtn.getName());
            multiPlayerMode.anchor.setTo(0.5, 0.5);
            multiPlayerMode.width = 200;
            multiPlayerMode.height = 50;
            multiPlayerMode.tint = 0.8 * 0xffffff;

            const multiplayerlabel = this.game.add.text(this.game.world.width / 2, this.game.world.height - 80,
                'Multiplayer',
                { font: '12px Arial', fill: '#ffffff' });
            multiplayerlabel.anchor.setTo(0.5, 0.5);
            multiplayerlabel.scale.setTo(1.6, 1.5);

            this.game.add.tween(multiplayerlabel).to({ angle: -2 }, 500).to({ angle: 2 }, 1000)
                .to({ angle: 0 }, 500).loop().start();

            multiPlayerMode.inputEnabled = true;
            multiPlayerMode.events.onInputDown.add(this._startMultiplayer, this);
        }

    }

    private _loadBestScore(): void {
        if (!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', '0');
        } else if (Math.max(store.scorePlayer1, store.scorePlayer2) > Number(localStorage.getItem('bestScore'))) {
            localStorage.setItem('bestScore', Math.max(store.scorePlayer1, store.scorePlayer2).toString());
            store.scorePlayer1 = 0;
            store.scorePlayer2 = 0;
        }
    }

    private _toggleSound(): void {
        this.game.sound.mute = !this.game.sound.mute;
        this._muteButton.frame = this.game.sound.mute ? 1 : 0;
    }

    private _startGame(): void {
        if (this.game.device.desktop === false && this.game.input.y < 50 && this.game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }
        this.game.state.start('game', true, false, { isMultiPlayerMode: false });
    }

    private _startMultiplayer(): void {
        if (this.game.device.desktop === false && this.game.input.y < 50 && this.game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }
        this.game.state.start('multiplayer');
    }
}