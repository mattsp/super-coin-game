import { store } from './../store';
import * as Assets from '../assets';
import PlayerBuilder from '../builder/PlayerBuilder';
import { Direction } from '../enums/direction';
export default class ControlBuilder extends Phaser.Group {
    private _cursor: Phaser.CursorKeys;
    private _wqzd: any;
    private _jumpButton: Phaser.Sprite;
    private _leftButton: Phaser.Sprite;
    private _rightButton: Phaser.Sprite;
    private _player1: PlayerBuilder;
    private _player2: PlayerBuilder;
    private _moveLeft: boolean;
    private _moveRight: boolean;

    constructor(game: Phaser.Game, player1: PlayerBuilder, player2?: PlayerBuilder) {
        super(game);
        this._player1 = player1;
        this._player2 = player2;
        this.game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this._cursor = this.game.input.keyboard.createCursorKeys();
        this._wqzd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        if (this.game.device.desktop === false) {
            this._addMobileInputs();
        }
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

        this._jumpButton.events.onInputDown.add(this._player1.jump, this._player1);

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


    public update(): void {
        if (this.game.input.totalActivePointers === 0) {
            this._moveLeft = false;
            this._moveRight = false;
        }

        if (this._cursor.left.isDown === true || this._moveLeft) {
            this._player1.move(Direction.Left);
        } else if (this._player2 && this._wqzd.left.isDown === true || this._moveLeft) {
            this._player2.move(Direction.Left);
        } else if (this._cursor.right.isDown === true || this._moveRight) {
            this._player1.move(Direction.Right);
        } else if (this._player2 && this._wqzd.right.isDown === true || this._moveRight) {
            this._player2.move(Direction.Right);
        }
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this._player1.stop();
            if (this._player2)
                this._player2.stop();
        }
        // If the up arrow key is pressed and the player is on the ground
        if (this._cursor.up.isDown) {
            // Move the player upward (jump)
            this._player1.move(Direction.Up);
        } else if (this._player2 && this._wqzd.up.isDown === true) {
            this._player2.move(Direction.Up);
        }
    }
}