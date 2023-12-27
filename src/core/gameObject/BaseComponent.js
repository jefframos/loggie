import * as signals from 'signals';

export default class BaseComponent {
    constructor() {
        this.enabled
        this.buildFrame = 0;
        this.gameObject = null;
        this.shouldBeRemoved = false;
    }
    reset() {
        this.shouldBeRemoved = false;
    }
    disable() { this.enabled = false; }
    enable() {
        this.enabled = true;
        this.shouldBeRemoved = false;
    }
    update() {
        if (this.buildFrame == 0) {
            this.buildFrame++;
            this.afterBuild();
        }
    }
    lateUpdate(){
        
    }
    build() {
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