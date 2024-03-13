import * as PIXI from 'pixi.js';
import GameView from './view/GameView';

export default class Layer {
    public layerName: string;
    public container: PIXI.Container;
    public cameraUpdate: boolean = false;
    public gameViews:GameView[] = []
    public sortable: boolean = false;
    public scrollable: boolean = true;

    constructor(name: string, container: PIXI.Container, sortable = true) {
        this.layerName = name;
        this.container = container;
        this.cameraUpdate = false;
        this.gameViews = []
        this.sortable = sortable;
        this.container.sortableChildren = true;
    }
    addGameView(gameView:GameView) {

        this.gameViews.push(gameView)
        this.container.addChild(gameView.view)
    }
    removeGameView(gameView:GameView) {
        for (let index = 0; index < this.gameViews.length; index++) {
            if (gameView == this.gameViews[index]) {
                this.gameViews.splice(index, 1)
                break
            }
        }        
        this.container.removeChild(gameView.view)
    }
    addChild(element) {
        this.container.addChild(element)
    }
    removeChild(element) {
        this.container.removeChild(element)
    }
    get children() {
        return this.container.children;
    }
    onRender() {

        for (var i = 0; i < this.gameViews.length; i++) {
            this.gameViews[i].onRender();
        }
        // if (!this.sortable) return;
        // this.container.children.sort((a, b) => {
        //     if (a.y < b.y) {
        //         return -1;
        //     } else if (a.y > b.y) {
        //         return 1;
        //     } else {
        //         return 0;
        //     }
        // });
    }
}