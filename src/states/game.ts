import { playerService } from './../services/PlayerService';
import * as Assets from '../assets';
import { Direction } from '../enum/Direction';
import CoinBuilder from '../builder/CoinBuilder';
import EnemeiesBuilder from '../builder/EnemiesBuilder';
import EnemiesBuilder from '../builder/EnemiesBuilder';
import LiveBuilder from '../builder/LiveBuilder';
import ParticuleBuilder from '../builder/ParticuleBuilder';
import { Player } from '../model/player';
import PlayerBuilder from '../builder/PlayerBuilder';
import ScoreBuilder from '../builder/ScoreBuilder';
import { ScreenMetrics } from './../utils/utils';
import SocketManager from '../network/SocketManager';
import WolrdBuilder from '../builder/WorldBuilder';
import { store } from './../store';
import { Event } from '../enum/PlayerEvent';

export default class Game extends Phaser.State {

    private _walls: WolrdBuilder;
    private _coin: CoinBuilder;
    private _score: ScoreBuilder;
    private _enemies: EnemeiesBuilder;
    private _enemyParticule: ParticuleBuilder;
    private _liveBuilder: LiveBuilder;
    private _backgroundSound: Phaser.Sound;
    private readonly MAX_LIVE = 3;
    private _socket: SocketManager;
    private _deltaTime = 0;

    public create(): void {
        this._socket = new SocketManager();
        this._socket.connect({
            onNewPLayer: this._addPlayer.bind(this),
            onMovePlayer: this._updateRemotePlayer.bind(this),
            onStopPlayer: this._stopRemotePlayer.bind(this),
            onRemovePlayer: this._removeRemotePlayer.bind(this)
        });
        this._walls = new WolrdBuilder(this.game);
        this._walls.createWorld();
        this._coin = new CoinBuilder(this.game, 96, 210);
        this._score = new ScoreBuilder(this.game, 48, 45);
        this._liveBuilder = new LiveBuilder(this.game, this.game.world.width - 84, 45, this.MAX_LIVE);
        // this._enemies = new EnemeiesBuilder(this.game);
        this._enemyParticule = new ParticuleBuilder(this.game, 0, 0, 15);
        this._backgroundSound = this.game.add.sound(Assets.Audio.AudioBackgrounSound.getName());
        this._backgroundSound.loop = true;
        this._backgroundSound.play();
    }

    public update(): void {
        // this._enemies.update();
        this._deltaTime = (this.game.time.elapsedMS * this.time.fps) / 1000;
        for (let player of playerService.getAll()) {

            this.game.physics.arcade.collide(player, this._walls);
            this.physics.arcade.overlap(player, this._coin, this._takeCoin, null, this);
            this.game.physics.arcade.collide(this._enemies, this._walls);
            this.game.physics.arcade.overlap(player, this._enemies, this._playerDie,
                null, this);

            if (player.alive === false) {
                return;
            }

            player.askMoveAction(this._checkMoveDirection.bind(this));

            if (player.inWorld === false) {
                this._playerDie();
            }
        }
    }

    private _localPlayerMove(direction: Direction): void {
        this._socket.emit(Event.MovePlayer, { direction });
    }

    private _localPlayerStop(direction: Direction): void {
        this._socket.emit(Event.StopPlayer, { direction });
    }

    private _stopRemotePlayer(remotePlayer: Player): void {
        const player = playerService.getById(remotePlayer.getID());
        if (player) {
            player.stop();
        }
    }

    private _updateRemotePlayer(remotePlayer: Player): void {
        const player = playerService.getById(remotePlayer.getID());
        if (player) {
            player.sentMoveAction(remotePlayer.getDirection(), this._deltaTime);
        }
    }

    private _checkMoveDirection(direction: Direction): void {
        if (!direction) {
            this._localPlayerStop(direction);
        } else {
            this._localPlayerMove(direction);
        }
    }

    private _removeRemotePlayer(remotePlayer: Player): void {
        let playerToremove: PlayerBuilder = playerService.delete(remotePlayer.getID());
        playerToremove.kill();
    }

    private _addPlayer(player: Player): void {
        const newPlayer = new PlayerBuilder(this.game, this.game.world.width / 2, (this.game.world.height / 2) + 100, player.getColor(), player.getID());
        playerService.save(newPlayer);
    }

    private _playerDie(player?: PlayerBuilder, enemies?: Phaser.Group): void {
        this._enemyParticule.x = player.x;
        this._enemyParticule.y = player.y;
        this._enemyParticule.start(true, 800, null, 15);
        this.game.camera.flash(0xffffff, 150);
        this.game.camera.shake(0.02, 150);
        player.playDieSound();
        if (this._liveBuilder.lives() > 1) {
            // this._enemies.killAll();
            this._liveBuilder.removeLive();
            player.reset(this.game.world.width / 2, this.game.world.height / 2);
        } else {
            // this._enemies.killAll();
            player.kill();
            this._liveBuilder.removeLive();
            this._backgroundSound.stop();
            this.game.time.events.add(500, this._startMenu, this);
        }

    }

    private _startMenu(): void {
        this.game.state.start('menu');
    }

    private _takeCoin(player: PlayerBuilder, coin: Phaser.Sprite): void {
        this._coin.kill();
        this._coin.playSound();
        this._score.add(5);
        this._coin.updatePosition();
        player.scalePlayer();

    }
}