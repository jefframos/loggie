import * as PIXI from 'pixi.js';

import GameView from './GameView';
import Utils from '../utils/Utils';
import Vector3 from '../gameObject/Vector3';

export default class LightSource extends GameView {
    constructor(gameObject) {
        super(gameObject);
        this.view = new PIXI.Sprite();
        this.view.anchor.set(0, 0.5)
        this.view.blendMode = PIXI.BLEND_MODES.COLOR_DODGE

        this.lightData = {
            radius: 100,
            radius2: 100,
            minFadeDistance: 100,
            maxFadeDistance: 150,
            angle1: 0,
            angle2: Math.PI / 2,

            coneAngle: 0.1,
            coneDistance: 10
        }
        this.setRadius(100)
        this.targetAngle = 0;
        this.intensity = 0;
        this.intensityModifier = 1;
    }
    setArc(radius, distance, arcAngle = Math.PI * 0.25) {
        this.lightData.type = 'arc';
        this.lightData.radius = radius;
        this.lightData.distance = distance;
        this.lightData.arcAngle = arcAngle;
        this.lightData.minDistance = this.lightData.radius
        this.lightData.maxDistance = this.lightData.radius * 3
        this.targetAngle = 0;

        this.view.width = distance * 1.5
        this.view.height = distance *2

        this.view.anchor.set(0, 0.5)
        this.view.texture = PIXI.Texture.from('light-beam')

    }
    setRadius(radius) {
        this.lightData.type = 'round';
        this.lightData.radius = radius;
        this.lightData.minDistance = this.lightData.radius
        this.lightData.maxDistance = this.lightData.radius * 1.5
        this.view.width = radius * 2.5
        this.view.height = radius * 2.5
        this.view.anchor.set(0.5)
        this.view.texture = PIXI.Texture.from('small-blur')

    }
    getDistanceFrom(position) {
        if (this.lightData.type == 'round') {
            return Utils.distance(this.gameObject.transform.position.x, this.gameObject.transform.position.z, position.x, position.z);
        }

        const centerX = this.gameObject.transform.position.x
        const centerY = this.gameObject.transform.position.z
        const pointX = position.x;
        const pointY = position.z;

        var startAngle = this.targetAngle - this.lightData.arcAngle
        var endAngle = this.targetAngle + this.lightData.arcAngle

        // Calculate the angle between the point and the center of the arc
        var angle = Math.atan2(pointY - centerY, pointX - centerX);


        // Check if the point is inside the arc
        let insideArc = false;

        if (startAngle < endAngle) {
            insideArc = angle >= startAngle && angle <= endAngle;
        } else {
            insideArc = angle >= startAngle || angle <= endAngle;
        }

        if (!insideArc) {
            if (angle < 0) {
                angle += Math.PI * 2;
            }
            if (startAngle < 0 || endAngle < 0) {
                startAngle += Math.PI * 2
                endAngle += Math.PI * 2
            }
            if (startAngle < endAngle) {
                insideArc = angle >= startAngle && angle <= endAngle;
            } else {
                insideArc = angle >= startAngle || angle <= endAngle;
            }
        }

        // Calculate the distance from the point to the center of the arc
        const dx = pointX - centerX;
        const dy = pointY - centerY;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        if (insideArc) {
            return distanceToCenter - this.lightData.distance;
        } else {
            return 1000//Utils.distance()

        }

    }

    distanceToLine(x1, y1, x2, y2, x0, y0) {
        const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
        const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        return numerator / denominator;
    }

    setColor(color = 0xFFFED9, intensity = 0.5) {
        this.intensity = intensity;
        this.view.tint = color
        this.view.alpha = intensity
    }

    update(delta) {
        super.update(delta);
        this.targetAngle = Utils.angleLerp(this.targetAngle, this.gameObject.parent.latestAngle, 0.5)
        this.targetAngle %= Math.PI * 2

        this.view.rotation = this.targetAngle;
        this.view.alpha = this.intensity * this.intensityModifier;
    }

    onRender() {
        super.onRender();

    }
}