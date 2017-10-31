import * as Assets from '../assets';
import * as Utils from '../utils/utils';

export default class Boot extends Phaser.State {

    public preload(): void {
        this.game.load.image(Assets.Images.ImagesProgressBar.getName(), Assets.Images.ImagesProgressBar.getPNG());
    }

    public create(): void {
        // Do anything here that you need to be setup immediately, before the game actually starts doing anything.

        // Uncomment the following to disable multitouch
        // this.input.maxPointers = 1;

        this.game.scale.scaleMode = Phaser.ScaleManager[SCALE_MODE];

        if (SCALE_MODE === 'USER_SCALE') {
            let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.screenMetrics;

            this.game.scale.setUserScale(screenMetrics.scaleX, screenMetrics.scaleY);
        }

        this.game.renderer.renderSession.roundPixels = true;
        this.game.stage.backgroundColor = '#3498db';

        if (this.game.device.desktop) {
            // Any desktop specific stuff here
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        } else {
            // Any mobile specific stuff here
            this.game.scale.setMinMax(this.game.width / 2, this.game.height / 2,
                this.game.width * 2, this.game.height * 2);

            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            document.body.style.backgroundColor = '#3498db';


            // Comment the following and uncomment the line after that to force portrait mode instead of landscape
            // this.game.scale.forceOrientation(true, false);
            // this.game.scale.forceOrientation(false, true);
        }

        // Use DEBUG to wrap code that should only be included in a DEBUG build of the game
        // DEFAULT_GAME_WIDTH is the safe area width of the game
        // DEFAULT_GAME_HEIGHT is the safe area height of the game
        // MAX_GAME_WIDTH is the max width of the game
        // MAX_GAME_HEIGHT is the max height of the game
        // game.width is the actual width of the game
        // game.height is the actual height of the game
        // GOOGLE_WEB_FONTS are the fonts to be loaded from Google Web Fonts
        // SOUND_EXTENSIONS_PREFERENCE is the most preferred to least preferred order to look for audio sources
        console.log(
            `DEBUG....................... ${DEBUG}
           \nSCALE_MODE.................. ${SCALE_MODE}
           \nDEFAULT_GAME_WIDTH.......... ${DEFAULT_GAME_WIDTH}
           \nDEFAULT_GAME_HEIGHT......... ${DEFAULT_GAME_HEIGHT}
           \nMAX_GAME_WIDTH.............. ${MAX_GAME_WIDTH}
           \nMAX_GAME_HEIGHT............. ${MAX_GAME_HEIGHT}
           \ngame.width.................. ${this.game.width}
           \ngame.height................. ${this.game.height}
           \nGOOGLE_WEB_FONTS............ ${GOOGLE_WEB_FONTS}
           \nSOUND_EXTENSIONS_PREFERENCE. ${SOUND_EXTENSIONS_PREFERENCE}`
        );

        this.game.state.start('preloader');
    }
}
