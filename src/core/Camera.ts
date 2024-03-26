import * as PIXI from 'pixi.js';

import GameObject from './gameObject/GameObject';
import Vector3 from './gameObject/Vector3';
import AppSingleton from 'loggie/AppSingleton';
import Utils from './utils/Utils';
export type WorldViewData = {
    width: number,
    height: number,
    center: PIXI.Point,
    x: number,
    y: number,
}
export default class Camera extends GameObject {
    static _instance = null;
    static Zoom = 1;
    public worldView: WorldViewData = {
        width: 1000,
        height: 1000,
        center: new PIXI.Point(),
        x: 0, y: 0
    }
    protected targetZoom: number = 1;
    protected targetPivot: PIXI.Point = new PIXI.Point();
    protected followPoint: Vector3 = new Vector3();
    constructor() {
        super()
        this.targetZoom = 1// Game.Debug.zoom || 0.75;
        this.followPoint = new Vector3();
    }
    setFollowPoint(followPoint: Vector3) {
        this.followPoint = followPoint;
    }
    setZoom(targetZoom: number = 1) {
        this.targetZoom = targetZoom;
    }
    forceZoom(targetZoom: number = 1) {
        this.targetZoom = targetZoom;
        Camera.Zoom = targetZoom;
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);

        Camera.Zoom = Utils.lerp(Camera.Zoom, this.targetZoom, 0.01 * delta * 60)

        this.worldView.width = AppSingleton.app.screen.width / Camera.Zoom
        this.worldView.height = AppSingleton.app.screen.height / Camera.Zoom
        this.worldView.x = this.targetPivot.x  - this.worldView.width / 2
        this.worldView.y = this.targetPivot.y - this.worldView.height / 2
        this.worldView.center.x = this.targetPivot.x
        this.worldView.center.y = this.targetPivot.y

    }
}