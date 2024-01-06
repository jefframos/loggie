
import GameView from './GameView';

export default class WorldGameView extends GameView {
    constructor(gameObject) {
        super(gameObject)
        this.pixelPerfect = false;
    }

    update(delta) {
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