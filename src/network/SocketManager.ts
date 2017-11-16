import { CoinEvent } from './../enum/CoinEvent';
import { EnemyEvent } from './../enum/EnemyEvent';
import * as io from 'socket.io-client';

import { Player } from '../model/Player';
import { store } from '../store';
import { playerService } from '../services/PlayerService';
import { PlayerEvent } from '../enum/PlayerEvent';
import { Direction } from '../enum/Direction';

interface ISocketGameEvent {
    onConnect?: Function;
    onDisconnect?: Function;
    onNewPLayer?: (player: Player) => {};
    onMovePlayer?: (player: Player) => {};
    onStopPlayer?: (player: Player) => {};
    onRemovePlayer?: (player: Player) => {};
    onRespawnEnemy?: (index: number) => {};
    onMoveEnemy?: (index: number, direction: Direction) => {};
    onRespawnCoin?: () => {};
}
export default class SocketManager {
    private _socket: SocketIOClient.Socket;

    public connect(options: ISocketGameEvent): void {
        if (!this._socket) {
            this._socket = io(SOCKET_URI);
            this._listen(options);
        }
    }

    public emit(event: string, data: any) {
        if (event) {
            this._socket.emit(event, data);
        }
    }

    private _listen(options: ISocketGameEvent): void {
        // Socket connection successful
        this._socket.on(PlayerEvent.Connect, (client) => { this._onSocketConnected(client, options.onConnect); });
        // Socket disconnection
        this._socket.on(PlayerEvent.Disconnect, (client) => { this._onClientDisconnect(client, options.onDisconnect); });
        // New player message received
        this._socket.on(PlayerEvent.New, (client) => { this._onNewPlayer(client, options.onNewPLayer); });
        // Player move message received
        this._socket.on(PlayerEvent.Move, (client) => { this._onMovePlayer(client, options.onMovePlayer); });
        // Player removed message received
        this._socket.on(PlayerEvent.Stop, (client) => { this._onStopPlayer(client, options.onStopPlayer); });
        // Player removed message received
        this._socket.on(PlayerEvent.Remove, (client) => { this._onRemovePlayer(client, options.onRemovePlayer); });
        // Enemy move message received
        this._socket.on(EnemyEvent.Move, (client) => { this._onMoveEnemy(client, options.onMoveEnemy); });
        // Enemy respawn message received
        this._socket.on(EnemyEvent.Respawn, (client) => { this._onRespawnEnemy(client, options.onRespawnEnemy); });
        // Coin respawn message received
        this._socket.on(CoinEvent.Respawn, (client) => { this._onRespawnCoin(client, options.onRespawnCoin); });
    }

    private _onSocketConnected(client, callback: Function): void {
        console.log('Connected to socket server');

        // Send local player data to the game server
        this._socket.emit(PlayerEvent.New, { color: Math.random() * 0xffffff });
        if (callback)
            callback();
    }

    private _onClientDisconnect(client, callback: Function): void {
        console.log('New player has connected: ' + client.id);
        if (callback)
            callback();
    }

    private _onNewPlayer(data, callback: (player: Player) => {}): void {
        console.log('New player connected: ' + data.id);

        // Initialise the new player
        const newPlayer = new Player(data.id, data.color);

        if (callback)
            callback(newPlayer);
    }

    private _onMovePlayer(data, callback: (player: Player) => {}): void {
        const movePlayer = playerService.getById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        movePlayer.direction = data.direction;

        if (callback)
            callback(movePlayer.toModel());
    }

    private _onStopPlayer(data, callback: (player: Player) => {}): void {
        const movePlayer = playerService.getById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        if (callback)
            callback(movePlayer.toModel());
    }

    private _onRemovePlayer(data, callback: (player: Player) => {}): void {
        const removePlayer = playerService.getById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        if (callback)
            callback(removePlayer.toModel());
    }

    private _onMoveEnemy(data, callback: (index: number, direction: Direction) => {}): void {
        if (callback)
            callback(data.index, data.direction);
    }

    private _onRespawnEnemy(data, callback: (index: number) => {}): void {
        if (callback)
            callback(data.index);
    }

    private _onRespawnCoin(data, callback: (newPosition: Array<number>) => {}) {
        if (callback)
            callback(data.newPosition);
    }
}