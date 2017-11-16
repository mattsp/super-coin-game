
import * as Assets from '../assets';

import { store } from '../store';
import { Sprite } from 'phaser-ce';
import { Direction } from '../enum/Direction';

export default class EnemiesBuilder extends Phaser.Group {
    private nextEnemy: number = 0;
    private readonly START_TIME_FREQ = 4000;
    private readonly END_TIME_FREQ = 1000;
    private readonly SCORE_PROGRESSION = 100;
    private _deltaTime: number;
    constructor(game: Phaser.Game, private _askRespawnEnemyCbk: Function, private _askMoveEnemyCbk: Function) {
        super(game);
        this.enableBody = true;
        this.createMultiple(10, Assets.Images.ImagesEnemy.getName());
    }

    public update() {
        if (this.nextEnemy < this.game.time.now) {
            const delay = Math.max(
                this.START_TIME_FREQ - (this.START_TIME_FREQ - this.END_TIME_FREQ) * store.score / this.SCORE_PROGRESSION, this.END_TIME_FREQ);
            this._addEnemy();
            this.nextEnemy = this.game.time.now + delay;
        }
    }

    private _addEnemy(): void {
        // Get the first dead enemy of the group
        const enemy: Phaser.Sprite = this.getFirstDead();
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }

        this._askAction(enemy);
    }

    private _askAction(enemy: Sprite) {
        const index = this.getIndex(enemy);
        const direction = this.game.rnd.pick([-1, 1]) === -1 ? Direction.Left : Direction.Right;
        this._askRespawnEnemyCbk(index);
        this._askMoveEnemyCbk(index, direction);
    }


    public sentMoveAction(index: number, direction: Direction, deltaTime: number) {
        const enemy = this.getChildAt(index) as Sprite;
        const directionValue = (direction === Direction.Left ? -1 : 1);
        if (store.score < 50) {
            enemy.scale.setTo(2, 2);
            enemy.body.velocity.x = (80 * directionValue) * deltaTime;
        } else {
            enemy.scale.setTo(0.5, 0.5);
            enemy.body.velocity.x = (200 * directionValue) * deltaTime;
        }
    }

    public sentRewpawnEnemy(index: number, deltaTime: number) {
        const enemy = this.getChildAt(index) as Sprite;
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(this.game.width / 2, 0);
        enemy.body.gravity.y = 500 * deltaTime;
        enemy.body.bounce.x = 1 * deltaTime;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    }
}