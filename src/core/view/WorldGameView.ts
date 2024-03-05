
import GameObject from '../gameObject/GameObject';
import GameView from './GameView';

export default class WorldGameView extends GameView {
    private pixelPerfect:boolean = false;
    constructor(gameObject:GameObject) {
        super(gameObject)
    }

    update(delta:number) {
        super.update(delta);
        if (this.pixelPerfect) {
            this.view.x = Math.round(this.transform.position.x)
            this.view.y = Math.round(this.transform.position.z + this.transform.position.y)
        } else {
            this.view.x = this.transform.position.x
            this.view.y = this.transform.position.z + this.transform.position.y
        }
    }

}