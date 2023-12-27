import * as PIXI from 'pixi.js';

export default class Layer {

    static Nothing = 0;
    static Everything = 1;
    static Default = 2;
    static Player = 1 << 1;
    static Enemy = 1 << 2;
    static Environment = 1 << 3;
    static Bullet = 1 << 4;
    static Sensor = 1 << 5;
    static FlightCompanion = 1 << 6;
    static EnemyBullet = 1 << 7;
    
    // static Player = 0b0001;
    // static Enemy = 0b0011;
    // static Environment = 0b0010;
    // static Bullet = 0b0100;
    // static Sensor = 0b0101;
    // static FlightCompanion =  0b0111;
    // static EnemyBullet =0b1001;

    static EnvironmentCollision = Layer.Player | Layer.Default | Layer.Enemy | Layer.Bullet

    static PlayerCollision = Layer.Environment | Layer.Default | Layer.Enemy | Layer.EnemyBullet
    static EnemyCollision = Layer.Bullet | Layer.Environment | Layer.Default | Layer.Player | Layer.Sensor  | Layer.Enemy

    static BulletCollision = Layer.Environment | Layer.Default | Layer.Enemy
    static EnemyBulletCollision = Layer.Environment | Layer.Default | Layer.Player

    constructor(name, container, sortable = true) {
        this.layerName = name;
        this.container = container;
        this.gameViews = []
        this.sortable = sortable;
        this.container.sortableChildren = true;
    }
    addGameView(gameView) {
        this.gameViews.push(gameView)
        this.container.addChild(gameView.view)
    }
    removeGameView(gameView) {

        for (let index = 0; index < this.gameViews.length; index++) {
            if (gameView == this.gameViews[index]) {
                this.gameViews.splice(index, 1)
                break
            }
        }

        this.container.removeChild(gameView.view)
    }
    addChild(element) {
        this.container.addChild(element)
    }
    removeChild(element) {
        this.container.removeChild(element)
    }
    get children() {
        return this.container.children;
    }
    onRender() {

        for (var i = 0; i < this.gameViews.length; i++){
            this.gameViews[i].onRender();
        }
        // if (!this.sortable) return;
        // this.container.children.sort((a, b) => {
        //     if (a.y < b.y) {
        //         return -1;
        //     } else if (a.y > b.y) {
        //         return 1;
        //     } else {
        //         return 0;
        //     }
        // });
    }
}