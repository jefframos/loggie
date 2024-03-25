
import * as PIXI from 'pixi.js';
import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';
import AppSingleton from 'loggie/AppSingleton';
import GameViewGraphics from '../view/GameViewGraphics';
import { InputDirections } from './InputDirection';
import MathUtils from 'loggie/utils/MathUtils';
import GameViewContainer from '../view/GameViewContainer';
import { RenderLayers } from '../render/RenderLayers';
import Overlay from '../ui/Overlay';
export enum AnalogInputType {
    WholeScreen = 0,
    Left = 1,
    Right = 2
}
export default class AnalogInput extends GameObject implements InputDirections {
    public onPointerDown: Signal = new Signal();
    public onPointerUp: Signal = new Signal();

    public pointerDown: boolean = false;
    public pointerUp: boolean = true;

    private pointerLatestPosition: PIXI.Point = new PIXI.Point();
    private pointerDownPosition: PIXI.Point = new PIXI.Point();

    public distanceFromOrigin: number = 0;
    private pointerMoveDirectionFromOrigin: PIXI.Point = new PIXI.Point();
    public directionAngle: number = 0;
    private graphicsContainer?: GameViewContainer;
    private stickContainer: PIXI.Container = new PIXI.Container();

    clickOrigin?: PIXI.Graphics;
    releaseOrigin?: PIXI.Graphics;
    private pad: PIXI.Graphics = new PIXI.Graphics();

    public stickMaxDistance: number = 100;
    public stickDistance: number = 0;

    private analogType: AnalogInputType = AnalogInputType.WholeScreen;


    build(analogType: AnalogInputType = AnalogInputType.WholeScreen): void {
        super.build();

        this.analogType = analogType;

        this.graphicsContainer = this.poolComponent(GameViewContainer, true)
        this.graphicsContainer.layer = RenderLayers.UILayerOverlay

        this.clickOrigin = new PIXI.Graphics();
        this.clickOrigin.beginFill(0xFFFFFF).drawCircle(0, 0, this.stickMaxDistance)
        this.clickOrigin.alpha = 0.2

        this.pad.beginFill(0xFFFFFF).drawRect(0, 0, 200, 200)
        this.graphicsContainer?.addChild(this.pad)
        this.pad.alpha = 0.1

        this.pad.interactive = true;

        this.releaseOrigin = new PIXI.Graphics();
        this.releaseOrigin.beginFill(0xFFFFFF).drawCircle(0, 0, 20)

        this.graphicsContainer?.addChild(this.stickContainer)


        this.stickContainer.addChild(this.clickOrigin)
        this.stickContainer.addChild(this.releaseOrigin)

        this.pad.onpointerdown = ((event: any) => {
            if (this.loggie.overlay.pointerOver) {
                return;
            }

            const toLocal = this.graphicsContainer?.view.toLocal(event)

            console.log(event, 'FIX POSITION OF THE ANALOGS AFTER USING GRAPHICS')

            if (
                this.analogType == AnalogInputType.Left && toLocal.x > this.loggie.overlay.right / 2 ||
                this.analogType == AnalogInputType.Right && toLocal.x < this.loggie.overlay.right / 2
            ) {
                return
            }
            this.pointerDown = true;
            this.pointerUp = false;

            if (toLocal) {
                this.pointerDownPosition.x = toLocal.x;
                this.pointerDownPosition.y = toLocal.y;
            }

            this.distanceFromOrigin = 0;
            this.onPointerDown.dispatch();
        });

        this.pad.onpointerup = ((event: any) => {

            const toLocal = this.graphicsContainer?.view.toLocal(event)

            if (
                this.analogType == AnalogInputType.Left && toLocal.x > this.loggie.overlay.right / 2 ||
                this.analogType == AnalogInputType.Right && toLocal.x < this.loggie.overlay.right / 2
            ) {
                return
            }

            this.pointerDown = false;
            this.pointerUp = true;

            this.pointerMoveDirectionFromOrigin = new PIXI.Point();
            this.distanceFromOrigin = MathUtils.distance(this.pointerDownPosition.x, this.pointerDownPosition.y, this.pointerLatestPosition.x, this.pointerLatestPosition.y);
            this.onPointerUp.dispatch();
        });


        this.pad.onglobalpointermove = ((event: any) => {

            const toLocal = this.graphicsContainer?.view.toLocal(event)
            if (toLocal) {
                this.pointerLatestPosition.x = toLocal.x;
                this.pointerLatestPosition.y = toLocal.y;
            }

            this.pointerMoveDirectionFromOrigin.x = this.pointerLatestPosition.x - this.pointerDownPosition.x
            this.pointerMoveDirectionFromOrigin.y = this.pointerLatestPosition.y - this.pointerDownPosition.y
            this.distanceFromOrigin = MathUtils.distance(this.pointerDownPosition.x, this.pointerDownPosition.y, this.pointerLatestPosition.x, this.pointerLatestPosition.y);

            MathUtils.normalizePoint(this.pointerMoveDirectionFromOrigin)

            this.directionAngle = Math.atan2(this.pointerMoveDirectionFromOrigin.y, this.pointerMoveDirectionFromOrigin.x)
        });

        this.pointerDown = false;
        this.pointerUp = true;
    }
    get normalDistance(): number {
        return this.stickDistance / this.stickMaxDistance;
    }
    updatePointers() {
        return
        const toLocal = this.graphicsContainer?.view.toLocal(AppSingleton.globalPointer)
        if (toLocal) {
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
        //this.updatePointers();

        if (this.analogType == AnalogInputType.Left) {
            this.pad.width = this.loggie.overlay.right / 2
            this.pad.height = this.loggie.overlay.down
            this.pad.x = 0
        }else if (this.analogType == AnalogInputType.Right) {
            this.pad.width = this.loggie.overlay.right / 2
            this.pad.height = this.loggie.overlay.down
            this.pad.x = this.loggie.overlay.right / 2
        }else{
            this.pad.width = this.loggie.overlay.right
            this.pad.height = this.loggie.overlay.down
        }

        if (this.pointerDown) {
            if (this.stickContainer) {
                this.stickContainer.visible = true;
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
            if (this.stickContainer) {
                this.stickContainer.visible = false;
            }
        }
    }
}
