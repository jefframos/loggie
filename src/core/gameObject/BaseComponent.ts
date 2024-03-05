import * as signals from 'signals';
import Loggie from '../Loggie';
import { TagType } from '../TagType';
import GameObject from './GameObject';

export default class BaseComponent {
    public engineID: number;

    private enabled: boolean = true;
    public engine: Loggie;
    protected buildFrame: number = 0;
    protected shouldBeRemoved: boolean = false;
    public gameObject!: GameObject;
    
    protected _tag: TagType = TagType.Untagged;

    constructor() {
        this.enabled
        this.buildFrame = 0;
        this.shouldBeRemoved = false;
        this.engine = Loggie.instance;

        this.engineID = ++GameObject.ObjectCounter;

    }
    public get tag(): TagType { return this._tag };
    public setTag(tag: TagType): void {
        this._tag = tag
    };
    protected reset() {
        this.shouldBeRemoved = false;
    }
    protected disable() { this.enabled = false; }
    protected enable() {
        this.enabled = true;
        this.shouldBeRemoved = false;
    }
    protected update(delta:number) {
        if (this.buildFrame == 0) {
            this.buildFrame++;
            this.afterBuild();
        }
    }
    protected lateUpdate() {

    }
    public build() {
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