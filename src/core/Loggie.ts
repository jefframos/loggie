import signals from 'signals';

import GameObject from "./gameObject/GameObject";
import PhysicsModule from "./modules/PhysicsModule";
import Pool from './utils/Pool';
import Camera from './Camera';
import RigidBody from './physics/RigidBody';
import BaseComponent from './gameObject/BaseComponent';
import RenderModule from './render/RenderModule';
import Overlay from './ui/Overlay';
import GuiDebugger from './debug/GuiDebugger';

export default class Loggie {

    static _instance: Loggie;
    static get instance() {
        return Loggie._instance;
    }

    public static PhysicsTimeScale: number = 1;
    public static TimeScale: number = 1;
    public static Time: number = 0;

    public entityAdded: signals.Signal = new signals.Signal();
    public componentAdded: signals.Signal = new signals.Signal();
    private gameObjects: Array<GameObject>;
    private resizeableList: Array<GameObject>;
    public parentGameObject: GameObject;
    public physics: PhysicsModule;
    public render!: RenderModule;
    public mainCamera!: Camera;

    private started: boolean = false;
    private callbacksWhenAdding: Map<string, Array<(gameObject: GameObject) => void>>;

    private engineStats:any;

    public get overlay():Overlay{
        return this.render.overlay;
    }
 
    constructor() {
        Loggie._instance = this;


        this.gameObjects = []
        this.resizeableList = []
        this.parentGameObject = new GameObject();
        this.physics = this.addGameObject(new PhysicsModule()) as PhysicsModule
        this.started = false;
        this.callbacksWhenAdding = new Map<string, Array<(gameObject: GameObject) => void>>();

        this.engineStats = {
            totalGameObjects:0
        }

        GuiDebugger.instance.listenFolder('Loggie', this.engineStats)
    }

    //helper to revome entity from list by its unique engine id
    static RemoveFromListById(list: Array<any>, gameObject: GameObject) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.GUID == gameObject.GUID) {
                list.splice(index, 1)
                break
            }

        }
    }

    setupRender(renderModule:RenderModule){
        this.render = this.addGameObject(renderModule) as RenderModule;;

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
        this.mainCamera = this.addGameObject(camera) as Camera;

        return this.mainCamera;
    }

    //add game object using pooling system
    poolGameObject<T>(constructor: any, rebuild: boolean = false, ...buildParams: any | undefined[]) : T{
        let element = Pool.instance.getElement(constructor)
        if (element.removeAllSignals) {
            element.removeAllSignals();
        }

        element.engine = this;
        element.enable()
        let go = this.addGameObject(element);
        if (rebuild) {
            element.build(buildParams);
        }
        return go as T;
    }

      //add game object using pooling system
      addNewGameObject<T>(constructor: any, rebuild: boolean = false, ...buildParams: any | undefined[]) : T{
        let element = new constructor();
        if (element.removeAllSignals) {
            element.removeAllSignals();
        }

        element.engine = this;
        element.enable()
        let go = this.addGameObject(element);
        if (rebuild) {
            element.build(buildParams);
        }
        return go as T;
    }
    //add game object on the engine 
    addGameObject<T>(gameObject: GameObject) : T{
        gameObject.loggie = this;


        // gameObject.gameObjectDestroyed = this.wipeGameObject.bind(this);
        // gameObject.childAdded = this.addGameObject.bind(this);
        // gameObject.componentAdded = this.onComponentAdded.bind(this);
        gameObject.gameObjectDestroyed.removeAll()
        gameObject.childAdded.removeAll()
        gameObject.componentAdded.removeAll()
        //add these event once to avoid duplications
        gameObject.gameObjectDestroyed.add(this.wipeGameObject.bind(this))
        gameObject.childAdded.add(this.addGameObject.bind(this))
        gameObject.componentAdded.add(this.onComponentAdded.bind(this))

        this.gameObjects.push(gameObject);
        if (!gameObject.parent) {
            this.parentGameObject.addChild(gameObject)
        }

        for (let index = 0; index < gameObject.children.length; index++) {
            const element = gameObject.children[index];
            if (element instanceof GameObject) {
                element.loggie = this;
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

        return gameObject as T;
    }

    //add physics agent if there is one
    addRigidBody(gameObject: RigidBody) {
        this.physics.addAgent(gameObject)
    }
    //destroy game object
    destroyGameObject(gameObject:GameObject) {
        gameObject.destroy()
    }
    //remove the game object from the world
    wipeGameObject(gameObject:GameObject) {

        Loggie.RemoveFromListById(this.gameObjects, gameObject)
        Loggie.RemoveFromListById(this.resizeableList, gameObject)

        if (gameObject.rigidBody) {
            this.physics.removeAgent(gameObject.rigidBody)
        }
    }
    onComponentAdded(component: BaseComponent) {
        this.componentAdded.dispatch(component);
    }
    tryFindByType<T>(type:any, out:any): void{
        let elementFound = null

        for (let index = 0; index < this.gameObjects.length; index++) {
            const element = this.gameObjects[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        out = elementFound as T;
    }
    //find go inside the engine (only on the top level)
    findByType<T>(type:any): T | null{
        let elementFound = null

        for (let index = 0; index < this.gameObjects.length; index++) {
            const element = this.gameObjects[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        return elementFound as T;
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

    update(delta: number, unscaledDelta: number) {
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

        this.engineStats.totalGameObjects = this.gameObjects.length;
    }
    aspectChange(isPortrait: boolean) {
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