
export default class OvertimeCallback {
    public time: number = 0
    public currentTime: number = 0
    public callback!: () => void;
    constructor(time: number, callback: () => void) {
        this.time = time;
        this.callback = callback;
        this.currentTime = time;
    }

    update(delta: number) {
        if (this.time <= 0) {
            return;
        }
        if (this.currentTime > 0) {
            this.currentTime -= delta;
            if (this.currentTime <= 0) {
                this.callback();
                this.currentTime = this.time;
            }
        }
    }
}