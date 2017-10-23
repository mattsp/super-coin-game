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
        const scoreText = 'score: ' + this.game['global'].score + '\nbest score: ' +
            localStorage.getItem('bestScore');

        // Show the score at the center of the screen
        const scoreLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2,
            scoreText,
            { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabel.anchor.setTo(0.5, 0.5);
        scoreLabel.scale.setTo(1.6, 1.5);

        let startLabelText: string;
        if (this.game.device.desktop) {
            startLabelText = 'press the up arrow key to start';
        }
        else {
            startLabelText = 'touch the screen to start';
        }

        const startLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height - 80,
            startLabelText,
            { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        startLabel.scale.setTo(1.6, 1.5);

        this.game.add.tween(startLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 1000)
            .to({ angle: 0 }, 500).loop().start();

        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start'
        const upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this._startGame, this);

        if (this.game.device.desktop === false) {
            this.game.input.onDown.add(this._startGame, this);
        }

    }

    private _loadBestScore(): void {
        if (localStorage.getItem('bestScore') === undefined) {
            localStorage.setItem('bestScore', '0');
        } else if (this.game['global'].score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', this.game['global'].score);
            this.game['global'].score = 0;
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
        this.game.state.start('game');
    }
}