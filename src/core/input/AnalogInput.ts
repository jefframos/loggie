
import * as PIXI from 'pixi.js';
import UiVew from '../ui/UiView';
import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';

export default class AnalogInput extends GameObject implements InputDirections {
    onPointerDown: Signal = new Signal();
    onPointerUp: Signal = new Signal();

    pointerDown: boolean = false;
    pointerUp: boolean = true;
    pointerLatestPosition: PIXI.Point = new PIXI.Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    pointerDownPosition: PIXI.Point = new PIXI.Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

    distanceFromOrigin: number = 0;
    pointerMoveDirectionFromOrigin: PIXI.Point = new PIXI.Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    directionAngle: number = 0;

    clickOrigin?: UiVew;
    releaseOrigin?: UiVew;

    stickMaxDistance: number = 100;
    stickDistance: number = 0;


    build(centerTexture: string, atlas: string, areaTexture: string): void {
        super.build();

        if (areaTexture) {

            this.clickOrigin = this.addFromPool(UiVew) as UiVew
            this.clickOrigin.build(areaTexture, atlas);
            this.clickOrigin.setAsUI();
            this.clickOrigin.view.setScale(this.stickMaxDistance / this.clickOrigin.view.width * 2, this.stickMaxDistance / this.clickOrigin.view.height * 2);
            this.clickOrigin.view.setVisible(false);
            this.clickOrigin.view.setScrollFactor(0)
            this.clickOrigin.view.setDepth(100)
            this.clickOrigin.view.setOrigin(0.5, 0.5)
        }

        this.releaseOrigin = this.addFromPool(UiVew) as UiVew
        this.releaseOrigin.build(centerTexture, atlas);
        this.releaseOrigin.setAsUI();
        this.releaseOrigin.view.setScale(1, 1);
        this.releaseOrigin.view.setScrollFactor(0)
        this.releaseOrigin.view.setDepth(100)
        this.releaseOrigin.view.setOrigin(0.5, 0.5)

        this.releaseOrigin.view.setVisible(false);

        this.scene.input.on('pointerdown', (pointer: any) => {
            // Log the initial touch position            

            if (this.eugine.uiCanvas.pointerOver) {
                return;
            }

            this.pointerDown = true;
            this.pointerUp = false;

            this.pointerDownPosition.x = pointer.x / this.eugine.uiCanvas.targetScale;
            this.pointerDownPosition.y = pointer.y / this.eugine.uiCanvas.targetScale;
            this.distanceFromOrigin = 0;
            this.onPointerDown.dispatch();
        });

        this.scene.input.on('pointerup', (pointer: any) => {
            // Log the initial touch position
            this.pointerDown = false;
            this.pointerUp = true;

            this.pointerMoveDirectionFromOrigin = new PIXI.Point();

            this.distanceFromOrigin = Phaser.Math.Distance.BetweenPoints(this.pointerDownPosition, this.pointerLatestPosition);
            this.onPointerUp.dispatch();
        });

        this.scene.input.on('pointermove', (pointer: any) => {
            // Add a pointermove event to track finger movement  

            this.pointerLatestPosition.x = pointer.x / this.eugine.uiCanvas.targetScale;
            this.pointerLatestPosition.y = pointer.y / this.eugine.uiCanvas.targetScale;

            this.pointerMoveDirectionFromOrigin = this.pointerLatestPosition.clone().subtract(this.pointerDownPosition).normalize();
            this.distanceFromOrigin = Phaser.Math.Distance.BetweenPoints(this.pointerDownPosition, this.pointerLatestPosition);

            this.directionAngle = this.pointerMoveDirectionFromOrigin.angle();
        });

        this.pointerDown = false;
        this.pointerUp = true;
    }
    get normalDistance() {
        return this.stickDistance / this.stickMaxDistance;
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
    lateUpdate(delta: number, time: number): void {
        super.lateUpdate(delta, time);
        if (this.pointerDown) {

            if (this.clickOrigin) {

                this.clickOrigin.x = this.pointerDownPosition.x;
                this.clickOrigin.z = this.pointerDownPosition.y;
                this.clickOrigin.view.setVisible(true);
            }

            this.stickDistance = this.stickMaxDistance > this.distanceFromOrigin ? this.distanceFromOrigin : this.stickMaxDistance;

            if (this.releaseOrigin) {
                this.releaseOrigin.x = (this.pointerDownPosition.x + Math.cos(this.directionAngle) * this.stickDistance);
                this.releaseOrigin.z = (this.pointerDownPosition.y + Math.sin(this.directionAngle) * this.stickDistance);
                this.releaseOrigin.view.setVisible(true);
            } else {

            }

        } else {
            this.clickOrigin?.view.setVisible(false);
            this.releaseOrigin?.view.setVisible(false);
        }
    }
}
