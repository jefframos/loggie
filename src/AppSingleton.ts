import * as PIXI from 'pixi.js';
import { Signal } from 'signals';
import ScreenInfo from './core/screen/ScreenInfo';
import ScreenManager from './screenManager/ScreenManager';
export default class AppSingleton {
    static app: PIXI.Application<HTMLCanvasElement>;
    static globalPointer: PIXI.Point = new PIXI.Point();
    static onPointerDown: Signal = new Signal();
    static onPointerUp: Signal = new Signal();
    static hasInteracted: boolean = false;
    static screenManager: ScreenManager;
    static ticker: PIXI.Ticker;
    static DEFAULT_RESOLUTION = {
        width: 1080,
        height: 1920,
        scale: 1
    }
    static DEFAULT_MOBILE_RESOLUTION = {
        width: 1080,
        height: 1920,
        scale: 1
    }
    static initialize(screenManager: ScreenManager) {

        this.screenManager = screenManager;
        AppSingleton.app.stage.addChild(screenManager)


        window.addEventListener('pointermove', (event) => {
            const { x, y } = event;
            AppSingleton.globalPointer.x = x;
            AppSingleton.globalPointer.y = y;
        });

        window.addEventListener('pointerdown', (event) => {
            AppSingleton.onPointerDown.dispatch(event)
        });

        window.addEventListener('pointerup', (event) => {
            AppSingleton.onPointerUp.dispatch(event)
        });
        window.addEventListener('resize', this.resize.bind(this));
        // Prepare for user interaction, and play the music on event
        document.addEventListener('pointerdown', () => {
            if (!AppSingleton.hasInteracted) {
                // Only play audio if it hasn't already been played
                //bgm.play('audio/bubbo-bubbo-bg-music.wav');
            }

            AppSingleton.hasInteracted = true;
        });

        // Check for visibility sate so we can mute the audio on "hidden"
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState !== 'visible') {
                // Always mute on hidden
                //audio.muted(true);
            }
            else {
                // Only unmute if it was previously unmuted
                //audio.muted(storage.getStorageItem('muted'));
            }
        });

        // Trigger the first resize        
        AppSingleton.resize();

        this.ticker = AppSingleton.app.ticker;

        // Add a tick event handler
        this.ticker.add((delta) => {
            // Your tick event logic goes here
            // This function will be called on each frame update
            this.screenManager.update(delta * 0.01)
        });

        // Start the rendering loop
        this.ticker.start();
    }
    static resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const minWidth = this.DEFAULT_RESOLUTION.width / 2;
        const minHeight = this.DEFAULT_RESOLUTION.height / 2;

        // Calculate renderer and canvas sizes based on current dimensions
        const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
        const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
        const scale = scaleX > scaleY ? scaleX : scaleY;
        const width = windowWidth * scale;
        const height = windowHeight * scale;

        // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
        AppSingleton.app.renderer.view.style.width = `${windowWidth}px`;
        AppSingleton.app.renderer.view.style.height = `${windowHeight}px`;
        window.scrollTo(0, 0);

        // Update renderer  and navigation screens dimensions
        AppSingleton.app.renderer.resize(width, height);

        ScreenInfo.gameWidth = width;
        ScreenInfo.gameHeight = height;
        //navigation.init();
        //navigation.resize(width, height);
    }

}