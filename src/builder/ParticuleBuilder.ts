import * as Assets from '../assets';

export default class ParticuleBuilder extends Phaser.Particles.Arcade.Emitter {
    constructor(game: Phaser.Game, x: number, y: number, maxParticule: number) {
        super(game, x, y, maxParticule);
        this.makeParticles(Assets.Images.ImagesPixel.getName());
        this.setYSpeed(-150, 150);
        this.setXSpeed(-150, 150);
        this.setScale(2, 0, 2, 0, 800);
        game.add.existing(this);
    }
}