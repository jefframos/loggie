import * as PIXI from 'pixi.js';

import { Elastic, TweenLite } from 'gsap';

import Signals from 'signals';
import utils from '../../../utils';

export default class TouchAxisInput extends PIXI.Container {
    constructor() {
        super();
        this.axis = [0, 0];
        this.angle = null;

        this.dist = 0;
        this.distN = 0;

        this.background = PIXI.Sprite.from('backanalog');
        this.background.anchor.set(0.5);
        this.addChild(this.background);

        this.center = PIXI.Sprite.from('stick');
        this.center.anchor.set(0.5);
        this.addChild(this.center);

        this.hitArea = new PIXI.Rectangle(-this.background.width, -this.background.height, this.background.width * 2, this.background.height * 2);
        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));
        this.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseDown.bind(this));
        this.on('mouseup', this.onMouseUp.bind(this)).on('touchend', this.onMouseUp.bind(this));
        this.on('mouseupoutside', this.onMouseOutside.bind(this)).on('touchendoutside', this.onMouseOutside.bind(this));

        this.onStartDrag = new Signals();
        this.onStopDrag = new Signals();

        this.id = Math.random();
        this.mainScale = 150 / this.background.height;
        this.scale.set(this.mainScale);
        this.maxDist = (this.center.width * 2);
    }
    testTouch(e) {
        if (!this.dragging) {
            return false
        }
        return this.touchID == e.data.identifier;
    }
    onMouseDown(e) {
        const globalTouch = e.data.global;
        const global = this.getGlobalPosition();

        this.currentDistance = utils.distance(globalTouch.x, globalTouch.y, global.x, global.y);
        if (this.currentDistance < this.maxDist) {
            this.touchID = e.data.identifier;
            
            this.dragging = true;
            if (this.currentDistance > 10) {


                this.angle = this.getAngle(e);
                const dist = this.getDist(e);

                this.distN = dist / this.maxDist;

                this.distN = Math.min(1, this.distN);

                this.dist = this.maxDist * 0.5 * this.distN;

                this.axis = [Math.cos(this.angle), Math.sin(this.angle)];
                this.center.x = this.axis[0] * this.dist;
                this.center.y = this.axis[1] * this.dist;

                this.onStartDrag.dispatch(this);
                TweenLite.killTweensOf(this.center);
            }
        }
        else {
            this.dragging = false;
        }
    }

    onMouseUp(e) {
        this.reset();
    }
    onMouseOutside(e) {
        this.reset();
    }
    onMouseMove(e) {
        if (this.dragging) {
            this.angle = this.getAngle(e);
            const dist = this.getDist(e);

            this.distN = dist / this.maxDist;

            this.distN = Math.min(1, this.distN);

            this.dist = this.maxDist * 0.5 * this.distN;

            this.axis = [Math.cos(this.angle), Math.sin(this.angle)];
            this.center.x = this.axis[0] * this.dist;
            this.center.y = this.axis[1] * this.dist;
        }
    }
    reset() {
        this.axis = [0, 0];
        this.currentPressed = [];
        this.dragging = false;
        this.touchID = null;
        this.onStopDrag.dispatch(this);
        TweenLite.to(this.center, 0.5, { x: 0, y: 0, ease: Elastic.easeOut });
    }
    getDist(e) {
        if (!this.testTouch(e)) {
            return this.currentDistance / this.mainScale;
        }
        const globalTouch = e.data.global;
        const global = this.getGlobalPosition();

        this.currentDistance = utils.distance(globalTouch.x, globalTouch.y, global.x, global.y);

        return this.currentDistance / this.mainScale;
    }
    getAngle(e) {
        if (!this.testTouch(e)) {
            return this.angle;
        }
        const globalTouch = e.data.global;
        const global = this.getGlobalPosition();

        return Math.atan2(globalTouch.y - global.y, globalTouch.x - global.x);
    }
    update() {

    }
}