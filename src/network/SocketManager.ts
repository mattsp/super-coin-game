import { multiplayer } from './Multiplayer';
import * as io from 'socket.io-client';

import Player from '../model/player';
import { store } from '../store';
import { playerService } from '../services/PlayerService';
import { Event } from '../enum/PlayerEvent';

interface ISocketOptions {
    onConnect?: Function;
    onDisconnect?: Function;
    onNewPLayer?: Function;
    onMovePlayer?: Function;
    onStopPlayer?: Function;
    onRemovePlayer?: Function;
}
export default class SocketManager {
    private _socket: SocketIOClient.Socket;

    public connect(options: ISocketOptions): void {
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

    private _listen(options: ISocketOptions): void {
        // Socket connection successful
        this._socket.on(Event.Connect, (client) => { this._onSocketConnected(client, options.onConnect); });
        // Socket disconnection
        this._socket.on(Event.Disconnect, (client) => { this._onClientDisconnect(client, options.onDisconnect); });
        // New player message received
        this._socket.on(Event.NewPlayer, (client) => { this._onNewPlayer(client, options.onNewPLayer); });
        // Player move message received
        this._socket.on(Event.MovePlayer, (client) => { this._onMovePlayer(client, options.onMovePlayer); });
        // Player removed message received
        this._socket.on(Event.StopPlayer, (client) => { this._onStopPlayer(client, options.onStopPlayer); });
        // Player removed message received
        this._socket.on(Event.RemovePlayer, (client) => { this._onRemovePlayer(client, options.onRemovePlayer); });
        // Player latency ping received
        this._socket.on(Event.LatencyPing, (client) => { this._onLatencyPingPlayer(client); });
        // Player game tick received
        this._socket.on(Event.GameTick, (client) => { this._onGameTickPlayer(client); });

    }

    private _onSocketConnected(client, callback: Function): void {
        console.log('Connected to socket server');

        // Send local player data to the game server
        this._socket.emit(Event.NewPlayer, { x: store.localPlayer.getX(), y: store.localPlayer.getY(), color: store.localPlayer.getColor() });
        if (callback)
            callback();
    }

    private _onClientDisconnect(client, callback: Function): void {
        console.log('New player has connected: ' + client.id);
        if (callback)
            callback();
    }

    private _onNewPlayer(data, callback: Function): void {
        console.log('New player connected: ' + data.id);

        // Initialise the new player
        const newPlayer = new Player(data.x, data.y);
        newPlayer.setID(data.id);
        newPlayer.setColor(data.color);
        // Add new player to the remote players array
        store.remotePlayers.set(newPlayer.getID(), newPlayer);
        if (callback)
            callback(newPlayer);
    }

    private _onMovePlayer(data, callback: Function): void {
        const movePlayer = playerService.getFromStoreById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);
        movePlayer.setDirection(data.direction);
        if (callback)
            callback(movePlayer);
    }

    private _onStopPlayer(data, callback: Function): void {
        const movePlayer = playerService.getFromStoreById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);
        if (callback)
            callback(movePlayer);
    }

    private _onRemovePlayer(data, callback: Function): void {
        const removePlayer = playerService.getFromStoreById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log('Player not found: ' + data.id);
            return;
        }

        if (callback)
            callback(removePlayer);

        // Remove player from array
        store.remotePlayers.delete(removePlayer.getID());
    }

    private _onLatencyPingPlayer(data): void {
        this._socket.emit(Event.LatencyPong, data);
    }

    private _onGameTickPlayer(data): void {
        multiplayer.lastReceivedTick = data.tick;
        multiplayer.commands[data.tick] = data.commands;
    }
}