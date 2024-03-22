import * as signals from 'signals';
import Loggie from '../Loggie';
import { TagType } from '../TagType';
import GameObject from './GameObject';

export default class BaseComponent {
    public engineID: number;

    public enabled: boolean = true;
    public loggie: Loggie;
    protected buildFrame: number = 0;
    public shouldBeRemoved: boolean = false;
    public gameObject!: GameObject;
    
    public _tag: TagType = TagType.Untagged;

    constructor() {
        this.enabled
        this.buildFrame = 0;
        this.shouldBeRemoved = false;
        this.loggie = Loggie.instance;

        this.engineID = ++GameObject.ObjectCounter;

    }
    public get tag(): TagType { return this._tag };
    public setTag(tag: TagType): void {
        this._tag = tag
    };
    public reset() {
        this.shouldBeRemoved = false;
    }
    public disable() { this.enabled = false; }
    public enable() {
        this.enabled = true;
        this.shouldBeRemoved = false;
    }
    public update(delta:number, unscaledDelta:number) {
        if (this.buildFrame == 0) {
            this.buildFrame++;
            this.afterBuild();
        }
    }
    public lateUpdate(delta:number, unscaledDelta:number) {

    }
    public build(...data: any[]) {
        this.buildFrame = 0;
        this.shouldBeRemoved = false;
    }
    afterBuild() { }
    start() { }
    onRender() { }
    destroy() { }
    remove() { this.shouldBeRemoved = true; }
    afterDestroy() { }
    removeAllSignals() {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element instanceof signals.Signal) {
                    element.removeAll();
                }
            }
        }
    }
}