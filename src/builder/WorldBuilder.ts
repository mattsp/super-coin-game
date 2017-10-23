import * as Assets from '../assets';

export default class WorldBuilder extends Phaser.Group {
    constructor(game: Phaser.Game) {
        super(game, null, null, true);
        this.enableBody = true;
        game.add.existing(this);
    }

    public createWorld(): void {
        // Left
        const leftWall = this.game.add.sprite(0, 0, Assets.Images.ImagesWallVertical.getName(), 0, this);
        leftWall.scale.setTo(1, 1.5);

        // Right
        const rightWall = this.game.add.sprite(this.game.world.width - 20, 0, Assets.Images.ImagesWallVertical.getName(), 0, this);
        rightWall.scale.setTo(1, 1.5);

        // Top left
        const topLeftWall = this.game.add.sprite(0, 0, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        topLeftWall.scale.setTo(1.6, 1);

        // Top right
        const topRighttWall = this.game.add.sprite(480, 0, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        topRighttWall.scale.setTo(1.6, 1);

        // Bottom left
        const bottomLeft = this.game.add.sprite(0, 480, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        bottomLeft.scale.setTo(1.6, 1);

        // Bottom right
        const bottomRight = this.game.add.sprite(480, 480, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        bottomRight.scale.setTo(1.6, 1);

        // Middle left
        const middleLeft = this.game.add.sprite(-160, 240, Assets.Images.ImagesWallHorizontal.getName(), 0, this); // Middle left
        middleLeft.scale.setTo(1.6, 1);

        // Middle right
        const middleRight = this.game.add.sprite(640, 240, Assets.Images.ImagesWallHorizontal.getName(), 0, this); // Middle right
        middleRight.scale.setTo(1.6, 1);

        // Middle top
        const middleTop = this.game.add.sprite(160, 120, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        middleTop.scale.setTo(2.4, 1);

        // Middle Bottom
        const middleBottom = this.game.add.sprite(160, 360, Assets.Images.ImagesWallHorizontal.getName(), 0, this);
        middleBottom.scale.setTo(2.4, 1);

        this.setAll('body.immovable', true);
    }
}