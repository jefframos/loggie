import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import BaseComponent from 'loggie/core/gameObject/BaseComponent';
import MathUtils from './MathUtils';
export default class FloatInterpolator extends BaseComponent {
    public target: number = 0;
    public value: number = 0;
    public lerp: number = 0.1;

    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);

        this.value = MathUtils.lerp(this.value, this.target, this.lerp)
    }
}