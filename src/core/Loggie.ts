import * as signals from 'signals';

import GameObject from "./gameObject/GameObject";
import PhysicsModule from "./modules/PhysicsModule";
import Pool from './utils/Pool';
import Camera from './Camera';

export default class Loggie {

    static _instance: Loggie;
    static get instance() {    
        return Loggie._instance;
    }

    public static PhysicsTimeScale: number = 1;
    public static TimeScale: number = 1;
    public static Time: number = 0;

    public entityAdded: signals.Signal = new signals.Signal();
    private gameObjects: Array<GameObject>;
    private resizeableList: Array<GameObject>;
    public parentGameObject: GameObject;
    public physics: PhysicsModule;
    public camera: Camera;

    private started: boolean = false;

    private callbacksWhenAdding: Map<string, Array<(gameObject: GameObject) => void>>;

    constructor() {
        Loggie._instance = this;
        
        this.entityAdded = new signals.Signal()
        this.gameObjects = []
        this.resizeableList = []
        this.parentGameObject = new GameObject();
        this.physics = this.addGameObject(new PhysicsModule()) as PhysicsModule
        this.started = false;
        this.callbacksWhenAdding = new Map<string, Array<(gameObject: GameObject) => void>>();

    }

    //helper to revome entity from list by its unique engine id
    static RemoveFromListById(list: Array<any>, gameObject: GameObject) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.engineID == gameObject.engineID) {
                list.splice(index, 1)
                break
            }

        }
    }
    callbackWhenAdding(constructor: any, callback: (gameObject: GameObject) => void) {
        if (!this.callbacksWhenAdding.has(constructor.name)) {
            this.callbacksWhenAdding.set(constructor.name, [callback]);
        } else {
            this.callbacksWhenAdding.get(constructor.name)?.push(callback);
        }
    }
    //add main camera
    addCamera(camera: Camera) {
        this.camera = this.addGameObject(camera) as Camera;

        return this.camera;
    }

    //add game object using pooling system
    poolGameObject(constructor: any, rebuild: boolean) {
        let element = Pool.instance.getElement(constructor)
        if (element.removeAllSignals) {
            element.removeAllSignals();
        }

        element.engine = this;
        element.enable()
        let go = this.addGameObject(element);
        if (rebuild) {
            element.build();
        }
        return go;
    }

    //add game object on the engine 
    addGameObject(gameObject: GameObject) {
        gameObject.engine = this;

        //add these event once to avoid duplications
        gameObject.gameObjectDestroyed.addOnce(this.wipeGameObject.bind(this))
        gameObject.childAdded.addOnce(this.addGameObject.bind(this))

        this.gameObjects.push(gameObject);
        if (!gameObject.parent) {
            this.parentGameObject.addChild(gameObject)
        }

        for (let index = 0; index < gameObject.children.length; index++) {
            const element = gameObject.children[index];
            if (element instanceof GameObject) {
                element.engine = this;
            }
        }
        //if the engine is started then start the gameobjects, otherwise will start when the engine starts
        if (this.started) {
            gameObject.start()
        }

        if (gameObject.resize) {
            this.resizeableList.push(gameObject);
        }
        this.entityAdded.dispatch([gameObject])

        if (this.callbacksWhenAdding && this.callbacksWhenAdding[gameObject.constructor.name]) {
            this.callbacksWhenAdding[gameObject.constructor.name].forEach(element => {
                element([gameObject]);
            });
            this.callbacksWhenAdding[gameObject.constructor.name] = [];
        }

        return gameObject;
    }

    //add physics agent if there is one
    addRigidBody(gameObject) {
        this.physics.addAgent(gameObject)
    }
    //destroy game object
    destroyGameObject(gameObject) {
        gameObject.destroy()
    }
    //remove the game object from the world
    wipeGameObject(gameObject) {

        Loggie.RemoveFromListById(this.gameObjects, gameObject)
        Loggie.RemoveFromListById(this.resizeableList, gameObject)

        if (gameObject.rigidBody) {
            this.physics.removeAgent(gameObject)
        }
    }
    //find go inside the engine (only on the top level)
    findByType(type) {
        let elementFound = null

        for (let index = 0; index < this.gameObjects.length; index++) {
            const element = this.gameObjects[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        return elementFound;
    }
    //start engine and the game objects
    start() {
        if (this.started) {
            return
        }
        this.started = true
        this.gameObjects.forEach(element => {
            element.start();
        })
    }

    update(delta:number, unscaledDelta:number) {
        Loggie.Time += unscaledDelta;
        if (!this.started) {
            return
        }
        this.gameObjects.forEach(element => {
            if (element.update && element.enabled && !element.destroyed) {
                element.update(delta * Loggie.TimeScale, delta);
            }
        });

        this.gameObjects.forEach(element => {
            if (element.onRender && element.enabled) {
                element.onRender();
            }
        });

        this.gameObjects.forEach(element => {
            if (element.lateUpdate && element.enabled) {
                element.lateUpdate(delta * Loggie.TimeScale, delta);
            }
        });

        // this.engineStats.totalGameObjects = this.gameObjects.length;
    }
    aspectChange(isPortrait) {
        this.resizeableList.forEach(element => {
            if (element.aspectChange && element.enabled) {
                element.aspectChange(isPortrait);
            }
        });
    }

    resize(resolution, innerResolution) {
        this.resizeableList.forEach(element => {
            if (element.resize && element.enabled) {
                element.resize(resolution, innerResolution);
            }
        });
    }
}