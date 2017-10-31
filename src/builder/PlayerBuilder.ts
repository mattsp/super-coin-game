import { IDUtils } from './../utils/utils';
import * as Assets from '../assets';
import { Direction } from '../enums/direction';

export default class PlayerBuilder extends Phaser.Sprite {
    private _id: number;
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

    constructor(game: Phaser.Game, x: number, y: number, color?: number, id?: number) {
        super(game, x, y, Assets.Spritesheets.SpritesheetsPlayer20205.getName(), 0);
        this._id = id;
        if (color) {
            this.tint = color;
        }
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
        game.add.existing(this);
    }

    public scalePlayer(): void {
        this.game.add.tween(this.scale).to({ x: 1.3, y: 1.3 }, 100)
            .yoyo(true).start();
    }

    public move(direction?: Direction): void {
        // If the left arrow key is pressed
        if (direction === Direction.Left) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.body.velocity.x = -200;
            this.animations.play('left');
        }
        // If the right arrow key is pressed
        else if (direction === Direction.Right) {
            // Move the player to the right
            this.body.velocity.x = 200;
            this.animations.play('right');
        }
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.stop();
        }
        // If the up arrow key is pressed and the player is on the ground
        if (direction === Direction.Up) {
            // Move the player upward (jump)
            this.jump();
        }
    }

    public jump() {
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

    public stop(): void {
        this.body.velocity.x = 0;
        this.animations.stop();
        this.frame = 0;
    }

    public playDieSound(): void {
        this._dieSound.play();
    }

    public getId(): number {
        return this._id;
    }
}