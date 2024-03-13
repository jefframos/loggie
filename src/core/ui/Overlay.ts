import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import GameViewContainer from '../view/GameViewContainer';
import { Signal } from 'signals';
import { OrientationType } from '../screen/OrientationType';
import GuiDebugger from '../debug/GuiDebugger';
import GameView from '../view/GameView';
import Layer from '../Layer';
import AppSingleton from 'loggie/AppSingleton';
export default class Overlay {

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

    public topLeft: PIXI.Point = new PIXI.Point();
    public topRight: PIXI.Point = new PIXI.Point();
    public bottomLeft: PIXI.Point = new PIXI.Point();
    public bottomRight: PIXI.Point = new PIXI.Point();
    public left: number = 0;
    public right: number = 0;
    public up: number = 0;
    public down: number = 0;
    public pointerOver: boolean = false;
    public targetScale: number = 1;
    public aspectRatio: number = 1;
    private latestAspectRatio = -1;

    private forcedOrientation: OrientationType = OrientationType.ForcePortrait;

    public onOrientationChange: Signal = new Signal();

    get platformScale(): number {
        if (this.isMobile) {
            return Overlay.DEFAULT_MOBILE_RESOLUTION.scale
        } else {
            return Overlay.DEFAULT_RESOLUTION.scale
        }
    }

    get minWidth(): number {
        if (this.isMobile) {
            if (this.isPortrait) {
                return Overlay.DEFAULT_MOBILE_RESOLUTION.width
            } else {
                return Overlay.DEFAULT_MOBILE_RESOLUTION.height
            }
        }
        if (this.isPortrait) {
            return Overlay.DEFAULT_RESOLUTION.width
        } else {
            return Overlay.DEFAULT_RESOLUTION.height
        }
    }
    get minHeight(): number {
        if (this.isMobile) {
            if (this.isPortrait) {
                return Overlay.DEFAULT_MOBILE_RESOLUTION.height
            } else {
                return Overlay.DEFAULT_MOBILE_RESOLUTION.width
            }
        }
        if (this.isPortrait) {
            return Overlay.DEFAULT_RESOLUTION.height
        } else {
            return Overlay.DEFAULT_RESOLUTION.width
        }
    }
    get isPortrait() {
        if (this.forcedOrientation == OrientationType.ForcePortrait) {
            return true;
        } else if (this.forcedOrientation == OrientationType.ForceLandscape) {
            return false;
        }


        return window.innerWidth < window.innerHeight;
    }
    get canvasWidth() {
        return window.innerWidth;
    }
    get canvasHeight() {
        return window.innerHeight;
    }
    get halfWidth() {
        return this.topRight.x / 2;
    }
    get halfHeight() {
        return this.bottomRight.y / 2;
    }
    get isMobile() {
        return PIXI.isMobile
    }

    private debug: any = {
        targetScale: 0,
        right: 0,
        down: 0,
        canvasWidth: 0,
        canvasHeight: 0
    }

    public container: PIXI.Container;
    constructor(container: PIXI.Container) {

        this.container = container;
        GuiDebugger.instance.listenFolder('overlay', this.debug)
    }
    update(delta: number, unscaledTime: number) {
        // this.interactiveList = this.findInteractiveElements(this);

        this.pointerOver = this.container.children.some(child => {
            return child.interactive && child.getBounds().contains(AppSingleton.globalPointer.x, AppSingleton.globalPointer.y);
        });

        // this.interactiveList.forEach((child: PIXI.Container) => {
        //     if (!this.isContainerVisibleConsideringParents(child)) return;
        //     const bounds = child.getBounds();
        //     if (bounds.contains(this.scene.input.x, this.scene.input.y)) {
        //         this.pointerOver = true;
        //         return;
        //     }
        // });
        this.handleScaling();
        this.topLeft.x = 0;
        this.topLeft.y = 0;


        //if is not mobile, the scroll bar must be removed

        let width = window.innerWidth // this.scene.game.canvas.width
        let height = window.innerHeight // window.innerHeight
        
        this.bottomRight.x = width / this.targetScale;
        this.bottomRight.y = height / this.targetScale;

        this.bottomLeft.x = 0;
        this.bottomLeft.y = height / this.targetScale;

        this.topRight.x = width / this.targetScale;
        this.topRight.y = 0;

        this.right = width / this.targetScale;
        this.down = height / this.targetScale;

        this.container.width = this.canvasWidth
        this.container.height = this.canvasHeight

        this.container.scale.set(this.targetScale, this.targetScale)

        //console.log(this.targetScale)


        this.aspectRatio = this.canvasWidth / this.canvasHeight;

        if (Math.floor(this.latestAspectRatio) != Math.floor(this.aspectRatio)) {
            this.onOrientationChange.dispatch(Math.floor(this.aspectRatio));
        }
        this.latestAspectRatio = this.aspectRatio;

        this.debug.right = this.right
        this.debug.down = this.down
        this.debug.targetScale = this.targetScale.toFixed(2)
        this.debug.canvasWidth = this.canvasWidth
        this.debug.canvasHeight = this.canvasHeight
    }
    orientationChange() {
        this.latestAspectRatio = -1
    }
    findTopLevelParent(gameObject: Phaser.GameObjects.GameObject): Phaser.GameObjects.GameObject | null {
        // Recursive function to find the top-level parent
        if (gameObject.parentContainer) {
            // If the GameObject has a parent container, recursively call the function
            return this.findTopLevelParent(gameObject.parentContainer);
        } else {
            // If there is no parent container, this is the top-level parent
            return gameObject;
        }
    }

    handleScaling() {

        if (this.canvasWidth < this.minWidth || this.canvasHeight < this.minHeight) {
            const minWidthScale = this.canvasWidth / this.minWidth;
            const minHeightScale = this.canvasHeight / this.minHeight;
            const minScale = Math.min(minWidthScale, minHeightScale);
            this.targetScale = minScale * this.platformScale;

        } else {
            this.targetScale = 1 * this.platformScale;
        }
    }

    isContainerVisibleConsideringParents(container: PIXI.Container): boolean {
        // Recursive function to check visibility of parents
        // Check if the container is visible and its parents are visible
        return container.visible && this.checkParentsVisibility(container);
    }

    checkParentsVisibility(container: PIXI.Container): boolean {
        if (container.parent) {
            // If parent is not visible, return false
            if (!container.parent.visible) {
                return false;
            }

            // Continue checking parents recursively
            return this.checkParentsVisibility(container.parent);
        }

        // Top-level parent reached
        return true;
    }

    worldToUiPosition(x: number, y: number): PIXI.Point {
        return this.toLocal({ x, y })
    }

    addChild(child: PIXI.DisplayObject) {

        this.container.addChild(child)
    }
    removeChild(child: PIXI.DisplayObject) {

        this.container.removeChild(child)
    }


    // onRender() {

    //     for (var i = 0; i < this.gameViews.length; i++) {
    //         this.gameViews[i].onRender();
    //     }
    //     // if (!this.sortable) return;
    //     // this.container.children.sort((a, b) => {
    //     //     if (a.y < b.y) {
    //     //         return -1;
    //     //     } else if (a.y > b.y) {
    //     //         return 1;
    //     //     } else {
    //     //         return 0;
    //     //     }
    //     // });
    // }
}