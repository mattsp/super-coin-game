import * as AssetUtils from '../utils/assetUtils';
import * as Assets from '../assets';

export default class Preloader extends Phaser.State {

    private _loadingLabel: Phaser.Sprite;
    private _progressBar: Phaser.Sprite;

    public preload(): void {
        this._loadingLabel = this.game.add.text(this.game.world.width / 2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        this._loadingLabel.anchor.setTo(0.5, 0.5);
        this._progressBar = this.game.add.sprite(this.game.world.width / 2, 200, Assets.Images.ImagesProgressBar.getName());
        this._progressBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(this._progressBar);
        AssetUtils.Loader.loadAllAssets(this.game);
    }

    public create(): void {
        this._startMenu();
    }

    private _startMenu(): void {
        this.state.start('menu');
    }
}
