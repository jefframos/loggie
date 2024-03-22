import * as signals from 'signals';

import BaseComponent from "./BaseComponent";
import Pool from '../utils/Pool';
import Transform from "./Transform";
import Vector3 from './Vector3';
import Loggie from '../Loggie';
import { TagType } from '../TagType';
import RigidBody from '../physics/RigidBody';
import MathUtils from 'loggie/utils/MathUtils';

export type EntityByDistance = {
    distance: number,
    entity: GameObject | null
}

export default class GameObject extends BaseComponent {
    static ObjectCounter = 0;
    protected isDestroyed = false;

    public engineID: number;
    public transform: Transform;
    public children: Array<GameObject> = []
    public components: Array<BaseComponent> = [];

    public parent?: GameObject;
    public rigidBody!: RigidBody;

    public gameObjectDestroyed = new signals.Signal();
    public childAdded = new signals.Signal();
    public childRemoved = new signals.Signal();
    public rigidbodyAdded = new signals.Signal();
    public componentAdded = new signals.Signal();
    constructor() {
        super();

        this.transform = new Transform(this);
        this.gameObject = this;
        this.engineID = ++GameObject.ObjectCounter;

    }
    start() {
        this.isDestroyed = false;
    }
    findComponentGameObject(type: any) {
        let elementFound = null

        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        return elementFound;
    }
    findComponent(type: any) {
        let elementFound = null

        for (let index = 0; index < this.components.length; index++) {
            const element = this.components[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        return elementFound;
    }
    findComponents(type: any) {
        let elementFound = []

        for (let index = 0; index < this.components.length; index++) {
            const element = this.components[index];
            if (element instanceof type) {
                elementFound.push(element);                
            }
        }
        return elementFound;
    }
    addComponent(constructor: any, autoBuild:boolean = false, ...buildParams: any | undefined[]) {
        let element = Pool.instance.getElement(constructor)
        this.components.push(element);
        element.gameObject = this;
        element.enable();
        if(autoBuild){
            element.build(buildParams);
        }
        this.componentAdded.dispatch(element);
        return element;
    }

    addGameObject(constructor: any, autoBuild:boolean = false, ...buildParams: any | undefined[]) {
        let element = Pool.instance.getElement(constructor)
        this.children.push(element);
        element.setParent(this)
        element.enable();
        if(autoBuild){
            element.build(buildParams);
        }
        this.childAdded.dispatch(element);        
        return element;
    }

    removeComponent(component: any) {
        this.components = this.components.filter(item => item !== component)
        Pool.instance.returnElement(component)
    }
    addChild(gameObject: GameObject) {
        gameObject.setParent(this)
        this.childAdded.dispatch(gameObject)
        this.children.push(gameObject);
    }
    setActive(value = true) {
        if (value == this.enabled) return;
        if (value) {
            this.enable();
        } else {
            this.disable();
        }
    }
    get forward() {
        let rad = this.transform.angle // 180 * Math.PI
        return { x: Math.cos(rad), y: Math.sin(rad) }
    }
    get facingDirection() {
        let rad = this.transform.angle;
        return rad
    }
    get x():number{
        return this.transform.position.x
    }
    get y():number{
        return this.transform.position.y
    }
    get z():number{
        return this.transform.position.z
    }
    /**
     * @param {number} value
     */
    set x(value: number) {
        this.transform.position.x = value
    }
    /**
     * @param {number} value
     */
    set y(value: number) {
        this.transform.position.y = value
    }
    set z(value: number) {
        this.transform.position.z = value
    }
    setPosition(x: number, y: number, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    setPositionXZ(x: number, z = 0) {
        this.x = x
        this.z = z
    }
    onRender() {
        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];
            if (element.enabled) {
                element.onRender();
            }
        }
    }
     update(delta: number, unscaledDelta:number) {
        super.update(delta, unscaledDelta);
        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];
            if (element.shouldBeRemoved) {
                this.components.splice(i, 1);
                continue;
            }
            if (element.enabled) {
                element.update(delta, unscaledDelta);
            }
        }

        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];
            if (element.shouldBeRemoved) {
                this.components.splice(i, 1);
                continue;
            }
            if (element.enabled) {
                element.lateUpdate(delta, unscaledDelta);
            }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            const element = this.children[i];
            if (element.shouldBeRemoved) {
                this.children.splice(i, 1);
                continue;
            }
            if (element.enabled) {
                element.update(delta, unscaledDelta);
            }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            const element = this.children[i];
            if (element.shouldBeRemoved) {
                this.children.splice(i, 1);
                continue;
            }
            if (element.enabled) {
                element.lateUpdate(delta, unscaledDelta);
            }
        }
    }
    enable() {
        this.enabled = true;
        this.isDestroyed = false;
        this.components.forEach(element => {
            element.enable();
        });

        this.children.forEach(element => {
            element.enable();
        });
    }
    disable() {
        this.enabled = false;
        this.components.forEach(element => {
            element.disable();
        });

        this.children.forEach(element => {
            element.disable();
        });
    }
    destroy() {
        if (this.isDestroyed) {
            console.log("Trying to destroy object that is already destroyed", this);
            // console.trace(this);
            return;
        }

        this.isDestroyed = true;
        this.gameObjectDestroyed.dispatch(this);

        if (this.parent) {
            this.parent.removeChild(this)
            this.transform.parent = undefined;
        }

        if (this.children.length) {
            for (let index = this.children.length - 1; index >= 0; index--) {
                const element = this.children[index];
                this.childRemoved.dispatch(element)
                element.destroy();
                this.children.splice(index, 1);
            }
        }
        this.components.forEach(element => {
            element.destroy();
            this.removeComponent(element)
        });
        this.disable();
        super.destroy();
        Pool.instance.returnElement(this)
    }

    removeChild(child: GameObject) {

        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if (element.engineID == child.engineID) {
                this.children.splice(index, 1)
                break
            }

        }
    }
    setParent(newParent: GameObject) {
        if (this.parent && this.parent != newParent) {
            this.parent.removeChild(this)
        }
        this.parent = newParent;
        this.transform.parent = newParent.transform;
        this.getNewParent(newParent);

    }
    getNewParent(newParent: GameObject) {

    }
    get destroyed() {
        return this.isDestroyed
    }
    get enabledAndAlive() {
        return this.enabled && !this.isDestroyed
    }

    static findClosestEntity(go:GameObject, entities: Array<GameObject>): EntityByDistance {
        let closestEntity: EntityByDistance = {
            distance: 0,
            entity: null
        };
        let closestDistance = Number.MAX_VALUE;

        entities.forEach(element => {

            if(element != go){
                const distance = MathUtils.distance(element.transform.position.x, element.transform.position.z, go.transform.position.x, go.transform.position.z);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEntity.entity = element;
                    closestEntity.distance = distance;
                }
            }
        });

        return closestEntity;
    }
}