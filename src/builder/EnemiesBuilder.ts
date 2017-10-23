import * as Assets from '../assets';

export default class EnemiesBuilder extends Phaser.Group {
    private nextEnemy: number = 0;
    private readonly START_TIME_FREQ = 4000;
    private readonly END_TIME_FREQ = 1000;
    private readonly SCORE_PROGRESSION = 100;

    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.createMultiple(10, Assets.Images.ImagesEnemy.getName());
    }

    public update() {
        if (this.nextEnemy < this.game.time.now) {
            const delay = Math.max(
                this.START_TIME_FREQ - (this.START_TIME_FREQ - this.END_TIME_FREQ) * this.game['global'].score / this.SCORE_PROGRESSION, this.END_TIME_FREQ);
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
        // Initialize the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(this.game.width / 2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
        if (this.game['global'].score < 50) {
            enemy.scale.setTo(2, 2);
            enemy.body.velocity.x = 80 * this.game.rnd.pick([-1, 1]);
        } else {
            enemy.scale.setTo(0.5, 0.5);
            enemy.body.velocity.x = 200 * this.game.rnd.pick([-1, 1]);
        }
    }
}