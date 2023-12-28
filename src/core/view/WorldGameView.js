
import GameView from './GameView';

export default class WorldGameView extends GameView {
    constructor(gameObject) {
        super(gameObject)
        this.pixelPerfect = false;
    }

    update(delta) {
        super.update(delta);
        if (this.pixelPerfect) {
            this.view.x = Math.round(this.gameView.transform.position.x)
            this.view.y = Math.round(this.gameView.transform.position.z + this.gameView.transform.position.y)
        } else {
            this.view.x = this.gameView.transform.position.x
            this.view.y = this.gameView.transform.position.z + this.gameView.transform.position.y
        }
    }

}