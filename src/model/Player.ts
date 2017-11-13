import { Direction } from '../enum/Direction';

export class Player {

    constructor(private _id: string, private _color: number, private _direction?: Direction) {
    }

    public getID(): string {
        return this._id;

    }
    public setID(id: string): void {
        this._id = id;

    }

    public setDirection(direction: Direction): void {

        this._direction = direction;
    }

    public getDirection(): Direction {
        return this._direction;
    }

    public getColor(): number {
        return this._color;
    }
}