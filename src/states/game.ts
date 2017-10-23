import * as Assets from '../assets';

import CoinBuilder from '../builder/CoinBuilder';
import EnemeiesBuilder from '../builder/EnemiesBuilder';
import EnemiesBuilder from '../builder/EnemiesBuilder';
import LiveBuilder from '../builder/LiveBuilder';
import ParticuleBuilder from '../builder/ParticuleBuilder';
import PlayerBuilder from '../builder/PlayerBuilder';
import ScoreBuilder from '../builder/ScoreBuilder';
import { ScreenMetrics } from './../utils/utils';
import WolrdBuilder from '../builder/WorldBuilder';

export default class Game extends Phaser.State {

    private _player: PlayerBuilder;
    private _walls: WolrdBuilder;
    private _coin: CoinBuilder;
    private _score: ScoreBuilder;
    private _enemies: EnemeiesBuilder;
    private _enemyParticule: ParticuleBuilder;
    private _liveBuilder: LiveBuilder;
    private _backgroundSound: Phaser.Sound;
    private readonly MAX_LIVE = 3;
    public create(): void {
        this._player = new PlayerBuilder(this.game, this.game.world.width / 2, this.game.world.height / 2);
        this._walls = new WolrdBuilder(this.game);
        this._walls.createWorld();
        this._coin = new CoinBuilder(this.game, 96, 210);
        this._score = new ScoreBuilder(this.game, 48, 45);
        this._liveBuilder = new LiveBuilder(this.game, this.game.world.width - 84, 45, this.MAX_LIVE);
        this._enemies = new EnemeiesBuilder(this.game);
        this._enemyParticule = new ParticuleBuilder(this.game, 0, 0, 15);
        this._backgroundSound = this.game.add.sound(Assets.Audio.AudioBackgrounSound.getName());
        this._backgroundSound.loop = true;
        this._backgroundSound.play();
    }

    public update(): void {
        this._enemies.update();
        this.game.physics.arcade.collide(this._player, this._walls);
        this.physics.arcade.overlap(this._player, this._coin, this._takeCoin, null, this);
        this.game.physics.arcade.collide(this._enemies, this._walls);
        this.game.physics.arcade.overlap(this._player, this._enemies, this._playerDie,
            null, this);

        if (this._player.alive === false) {
            return;
        }

        this._player.move();

        if (this._player.inWorld === false) {
            this._playerDie();
        }
    }

    private _playerDie(player?: Phaser.Sprite, enemies?: Phaser.Group): void {
        this._enemyParticule.x = this._player.x;
        this._enemyParticule.y = this._player.y;
        this._enemyParticule.start(true, 800, null, 15);
        this.game.camera.flash(0xffffff, 150);
        this.game.camera.shake(0.02, 150);
        this._player.playDieSound();
        if (this._liveBuilder.lives() > 1) {
            this._enemies.killAll();
            this._liveBuilder.removeLive();
            this._player.reset(this.game.world.width / 2, this.game.world.height / 2);
        } else {
            this._enemies.killAll();
            this._player.kill();
            this._liveBuilder.removeLive();
            this._backgroundSound.stop();
            this.game.time.events.add(500, this._startMenu, this);
        }

    }

    private _startMenu(): void {
        this.game.state.start('menu');
    }

    private _takeCoin(player: Phaser.Sprite, coin: Phaser.Sprite): void {
        this._coin.kill();
        this._coin.playSound();
        this._score.add(5);
        this._coin.updatePosition();
        this._player.scalePlayer();

    }
}