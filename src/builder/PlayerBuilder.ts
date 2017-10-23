import * as Assets from '../assets';

export default class PlayerBuilder extends Phaser.Sprite {
    private _cursor: Phaser.CursorKeys;
    private _jumpSound: Phaser.Sound;
    private _dieSound: Phaser.Sound;
    private _wqzd: any;
    private _jumpButton: Phaser.Sprite;
    private _leftButton: Phaser.Sprite;
    private _rightButton: Phaser.Sprite;
    private _moveLeft: boolean;
    private _moveRight: boolean;
    private _jumps: number = 2;
    private _jumping: boolean = false;
    private _jumpingTime: number = 0;
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Spritesheets.SpritesheetsPlayer20205.getName(), 0);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.body.gravity.y = 250;
        this._cursor = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this._wqzd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.Z),
            left: game.input.keyboard.addKey(Phaser.Keyboard.Q),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        this._jumpSound = this.game.add.audio(Assets.Audio.AudioJump.getName());
        this._dieSound = this.game.add.audio(Assets.Audio.AudioDead.getName());
        this.animations.add('right', [1, 2], 8, true);
        this.animations.add('left', [3, 4], 8, true);
        if (this.game.device.desktop === false) {
            this._addMobileInputs();
        }
        game.add.existing(this);
    }

    private _addMobileInputs(): void {
        this._jumpButton = this.game.add.sprite(560, 360, Assets.Images.ImagesJumpButton.getName());
        this._jumpButton.inputEnabled = true;
        this._jumpButton.alpha = 0.5;
        this._jumpButton.scale.setTo(1.6, 1.5);
        // Add the move left button
        this._leftButton = this.game.add.sprite(80, 360, Assets.Images.ImagesLeftButton.getName());
        this._leftButton.inputEnabled = true;
        this._leftButton.alpha = 0.5;
        this._leftButton.scale.setTo(1.6, 1.5);
        // Add the move right button
        this._rightButton = this.game.add.sprite(208, 360, Assets.Images.ImagesRightButton.getName());
        this._rightButton.inputEnabled = true;
        this._rightButton.alpha = 0.5;
        this._rightButton.scale.setTo(1.6, 1.5);

        this._jumpButton.events.onInputDown.add(this._jump, this);

        this._moveLeft = false;
        this._moveRight = false;

        this._leftButton.events.onInputOver.add(this._setLeftTrue, this);
        this._leftButton.events.onInputOut.add(this._setLeftFalse, this);
        this._leftButton.events.onInputDown.add(this._setLeftTrue, this);
        this._leftButton.events.onInputUp.add(this._setLeftFalse, this);

        this._rightButton.events.onInputOver.add(this._setRightTrue, this);
        this._rightButton.events.onInputOut.add(this._setRightFalse, this);
        this._rightButton.events.onInputDown.add(this._setRightTrue, this);
        this._rightButton.events.onInputUp.add(this._setRightFalse, this);


    }

    private _setLeftTrue(): void {
        this._moveLeft = true;
    }
    private _setLeftFalse(): void {
        this._moveLeft = false;
    }
    private _setRightTrue(): void {
        this._moveRight = true;
    }
    private _setRightFalse(): void {
        this._moveRight = false;
    }


    public scalePlayer(): void {
        this.game.add.tween(this.scale).to({ x: 1.3, y: 1.3 }, 100)
            .yoyo(true).start();
    }

    public move(): void {
        if (this.game.input.totalActivePointers === 0) {
            this._moveLeft = false;
            this._moveRight = false;
        }
        // If the left arrow key is pressed
        if (this._cursor.left.isDown === true || this._wqzd.left.isDown === true || this._moveLeft === true) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.body.velocity.x = -200;
            this.animations.play('left');
        }
        // If the right arrow key is pressed
        else if (this._cursor.right.isDown === true || this._wqzd.right.isDown === true || this._moveRight === true) {
            // Move the player to the right
            this.body.velocity.x = 320;
            this.animations.play('right');
        }
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.body.velocity.x = 0;
            this.animations.stop();
            this.frame = 0;
        }
        // If the up arrow key is pressed and the player is on the ground
        if (this._cursor.up.isDown || this._wqzd.up.isDown) {
            // Move the player upward (jump)
            this._jump();
        }
    }

    private _jump() {
        if (this.body.touching.down === true) {
            this.body.velocity.y = -200;
            this._jumpingTime = this.game.time.now;
            this._jumping = true;
        } else if ((this.game.time.now - this._jumpingTime) > 500 && this._jumping === true) {
            this.body.velocity.y = -200;
            this._jumping = false;
        }
        this._jumpSound.play();
    }

    public playDieSound(): void {
        this._dieSound.play();
    }
}