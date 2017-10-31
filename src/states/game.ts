import { store } from './../store';
import * as Assets from '../assets';

import ControlBuilder from '../builder/ControlBuilder';
import CoinBuilder from '../builder/CoinBuilder';
import EnemeiesBuilder from '../builder/EnemiesBuilder';
import EnemiesBuilder from '../builder/EnemiesBuilder';
import LiveBuilder from '../builder/LiveBuilder';
import ParticuleBuilder from '../builder/ParticuleBuilder';
import PlayerBuilder from '../builder/PlayerBuilder';
import ScoreBuilder from '../builder/ScoreBuilder';
import { Colorutils } from './../utils/utils';
import WolrdBuilder from '../builder/WorldBuilder';

export default class Game extends Phaser.State {

    private _controlBuilder: ControlBuilder;
    private _player1: PlayerBuilder;
    private _player2: PlayerBuilder;
    private _walls: WolrdBuilder;
    private _coin: CoinBuilder;
    private _scorePlayer1: ScoreBuilder;
    private _scorePlayer2: ScoreBuilder;
    private _enemies: EnemeiesBuilder;
    private _enemyParticule: ParticuleBuilder;
    private _liveBuilderPlayer1: LiveBuilder;
    private _liveBuilderPlayer2: LiveBuilder;
    private _backgroundSound: Phaser.Sound;
    private readonly MAX_LIVE = 3;

    public init(options): void {
        this._player1 = new PlayerBuilder(this.game, this.game.world.width / 2, this.game.world.height / 2, Colorutils.hexToNumber(options.playerColor1), 1);
        this._scorePlayer1 = new ScoreBuilder(this.game, 48, 45, null, options.playerName1);
        this._liveBuilderPlayer1 = new LiveBuilder(this.game, this.game.world.width - 84, 45, this.MAX_LIVE);
        if (options.isMultiPlayerMode === true) {
            this._player2 = new PlayerBuilder(this.game, this.game.world.width / 2 - 90, this.game.world.height / 2, Colorutils.hexToNumber(options.playerColor2), 2);
            this._scorePlayer2 = new ScoreBuilder(this.game, 48, 75, null, options.playerName2);
            this._liveBuilderPlayer2 = new LiveBuilder(this.game, this.game.world.width - 84, 75, this.MAX_LIVE);
        }
    }

    public create(): void {
        this._controlBuilder = new ControlBuilder(this.game, this._player1, this._player2);
        this._walls = new WolrdBuilder(this.game);
        this._walls.createWorld();
        this._coin = new CoinBuilder(this.game, 96, 210);
        this._enemies = new EnemeiesBuilder(this.game);
        this._enemyParticule = new ParticuleBuilder(this.game, 0, 0, 15);
        this._backgroundSound = this.game.add.sound(Assets.Audio.AudioBackgrounSound.getName());
        this._backgroundSound.loop = true;
        this._backgroundSound.play();
    }

    public update(): void {
        this._enemies.update();
        this.game.physics.arcade.collide(this._player1, this._walls);

        this.physics.arcade.overlap(this._player1, this._coin, this._takeCoin, null, this);
        this.game.physics.arcade.collide(this._enemies, this._walls);

        this.game.physics.arcade.overlap(this._player1, this._enemies, this._playerDie,
            null, this);
        if (this._player2) {
            this.game.physics.arcade.collide(this._player2, this._walls);
            this.game.physics.arcade.collide(this._player1, this._player2);
            this.physics.arcade.overlap(this._player2, this._coin, this._takeCoin, null, this);
            this.game.physics.arcade.overlap(this._player2, this._enemies, this._playerDie, null, this);
        }

        if (this._player1.alive === false) {
            return;
        }

        if (this._player2 && this._player2.alive === false) {
            return;
        }

        this._controlBuilder.update();

        if (this._player1.inWorld === false) {
            this._playerDie(this._player1);
        }
        if (this._player2 && this._player2.inWorld === false) {
            this._playerDie(this._player2);
        }
    }

    private _playerDie(player?: PlayerBuilder, enemies?: Phaser.Group): void {
        this._enemyParticule.x = player.x;
        this._enemyParticule.y = player.y;
        this._enemyParticule.start(true, 800, null, 15);
        this.game.camera.flash(0xffffff, 150);
        this.game.camera.shake(0.02, 150);
        player.playDieSound();
        if (player.getId() === 1 && this._liveBuilderPlayer1.lives() > 1) {
            this._enemies.killAll();
            this._liveBuilderPlayer1.removeLive();
            player.reset(this.game.world.width / 2, this.game.world.height / 2);
        }
        else if (player.getId() === 1 && this._liveBuilderPlayer1.lives() === 1) {
            this._enemies.killAll();
            player.kill();
            this._liveBuilderPlayer1.removeLive();
        }
        if (player.getId() === 2 && this._liveBuilderPlayer2.lives() > 1) {
            this._enemies.killAll();
            this._liveBuilderPlayer2.removeLive();
            player.reset(this.game.world.width / 2, this.game.world.height / 2);
        } else if (player.getId() === 2 && this._liveBuilderPlayer2.lives() === 1) {
            this._enemies.killAll();
            player.kill();
            this._liveBuilderPlayer2.removeLive();
        }
        if (this._liveBuilderPlayer1.lives() === 0 && this._liveBuilderPlayer2.lives() === 0) {
            this._backgroundSound.stop();
            this.game.time.events.add(500, this._startMenu, this);
        }
        this._enemies.killAll();

    }

    private _startMenu(): void {
        this.game.state.start('menu');
    }

    private _takeCoin(player: PlayerBuilder, coin: Phaser.Sprite): void {
        this._coin.kill();
        this._coin.playSound();
        if (player.getId() === 1) {
            store.scorePlayer1 += 5;
            this._scorePlayer1.add(5);
        } else {
            store.scorePlayer2 += 5;
            this._scorePlayer2.add(5);
        }
        this._coin.updatePosition();
        player.scalePlayer();

    }
}