
import * as PIXI from 'pixi.js';
import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';
import AppSingleton from 'loggie/AppSingleton';
import GameViewGraphics from '../view/GameViewGraphics';
import { InputDirections } from './InputDirection';
import MathUtils from 'loggie/utils/MathUtils';
import GameViewContainer from '../view/GameViewContainer';
import { RenderLayers } from '../render/RenderLayers';

export default class AnalogInput extends GameObject implements InputDirections {
    onPointerDown: Signal = new Signal();
    onPointerUp: Signal = new Signal();

    pointerDown: boolean = false;
    pointerUp: boolean = true;
    pointerLatestPosition: PIXI.Point = new PIXI.Point();
    pointerDownPosition: PIXI.Point = new PIXI.Point();

    distanceFromOrigin: number = 0;
    pointerMoveDirectionFromOrigin: PIXI.Point = new PIXI.Point();
    directionAngle: number = 0;
    graphicsContainer?: GameViewContainer;

    clickOrigin?: PIXI.Graphics;
    releaseOrigin?: PIXI.Graphics;

    stickMaxDistance: number = 100;
    stickDistance: number = 0;


    build(): void {
        super.build();

        this.graphicsContainer = this.addComponent(GameViewContainer, true)
        this.graphicsContainer.layer = RenderLayers.UILayerOverlay

        this.clickOrigin = new PIXI.Graphics();
        this.clickOrigin.beginFill(0xFFFFFF).drawCircle(0, 0, this.stickMaxDistance)
        this.clickOrigin.alpha = 0.2


        this.releaseOrigin = new PIXI.Graphics();
        this.releaseOrigin.beginFill(0xFFFFFF).drawCircle(0, 0, 20)

        this.graphicsContainer?.addChild(this.clickOrigin)
        this.graphicsContainer?.addChild(this.releaseOrigin)

        AppSingleton.onPointerDown.add((event: any) => {
            if (this.loggie.overlay.pointerOver) {
                return;
            }

            this.pointerDown = true;
            this.pointerUp = false;

            const toLocal = this.graphicsContainer?.view.toLocal(event)
            if(toLocal){
                this.pointerDownPosition.x = toLocal.x;
                this.pointerDownPosition.y = toLocal.y;
            }
            this.distanceFromOrigin = 0;
            this.onPointerDown.dispatch();
        });

        AppSingleton.onPointerUp.add((event: any) => {
            this.pointerDown = false;
            this.pointerUp = true;

            this.pointerMoveDirectionFromOrigin = new PIXI.Point();
            this.distanceFromOrigin = MathUtils.distance(this.pointerDownPosition.x, this.pointerDownPosition.y, this.pointerLatestPosition.x, this.pointerLatestPosition.y);
            this.onPointerUp.dispatch();
        });


        this.pointerDown = false;
        this.pointerUp = true;
    }
    get normalDistance(): number {
        return this.stickDistance / this.stickMaxDistance;
    }
    updatePointers() {


        const toLocal = this.graphicsContainer?.view.toLocal(AppSingleton.globalPointer)
        if(toLocal){
            this.pointerLatestPosition.x = toLocal.x;
            this.pointerLatestPosition.y = toLocal.y;
        }

        this.pointerMoveDirectionFromOrigin.x = this.pointerLatestPosition.x - this.pointerDownPosition.x
        this.pointerMoveDirectionFromOrigin.y = this.pointerLatestPosition.y - this.pointerDownPosition.y
        this.distanceFromOrigin = MathUtils.distance(this.pointerDownPosition.x, this.pointerDownPosition.y, this.pointerLatestPosition.x, this.pointerLatestPosition.y);

        MathUtils.normalizePoint(this.pointerMoveDirectionFromOrigin)
        
        this.directionAngle = Math.atan2(this.pointerMoveDirectionFromOrigin.y, this.pointerMoveDirectionFromOrigin.x)
    }
    getNormal(): number {
        return this.normalDistance
    }
    getPressed(): boolean {
        return this.pointerDown;
    }
    getDirections(): PIXI.Point {
        return this.pointerMoveDirectionFromOrigin;
    }
    update(delta: number, time: number): void {
        super.update(delta, time);
        this.updatePointers();

        if (this.pointerDown) {
            if (this.graphicsContainer) {
                this.graphicsContainer.view.visible = true;
            }
            if (this.clickOrigin) {

                this.clickOrigin.x = this.pointerDownPosition.x;
                this.clickOrigin.y = this.pointerDownPosition.y;
            }

            this.stickDistance = this.stickMaxDistance > this.distanceFromOrigin ? this.distanceFromOrigin : this.stickMaxDistance;

            if (this.releaseOrigin) {
                this.releaseOrigin.x = (this.pointerDownPosition.x + Math.cos(this.directionAngle) * this.stickDistance);
                this.releaseOrigin.y = (this.pointerDownPosition.y + Math.sin(this.directionAngle) * this.stickDistance);
            } else {

            }
        } else {
            if (this.graphicsContainer) {
                this.graphicsContainer.view.visible = false;
            }
        }
    }
}
