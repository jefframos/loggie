import * as signals from 'signals';

import BaseComponent from "./BaseComponent";
import Pool from '../utils/Pool';
import TagManager from '../TagManager';
import Transform from "./Transform";
import Vector3 from './Vector3';

export default class GameObject extends BaseComponent {
    static ObjectCounter = 0;
    constructor() {
        super();

        this.tag = TagManager.Tags.Untagged;
        this.gameObject = this;
        this.engineID = ++GameObject.ObjectCounter;
        this.transform = new Transform();
        this.children = []
        this.components = [];
        this.enabled = true;
        this.parent = null
        
        this.gameObjectDestroyed = new signals.Signal();
        this.childAdded = new signals.Signal();
        this.childRemoved = new signals.Signal();
        this.rigidbodyAdded = new signals.Signal();
        this.isDestroyed = false;
        this.viewOffset = new Vector3()

    }
    start() {
        this.isDestroyed = false;
    }
    findComponentGameObject(type) {
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
    findComponent(type) {
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
    addComponent(constructor) {
        let element = Pool.instance.getElement(constructor)
        this.components.push(element);
        element.gameObject = this;
        element.enable();
        return element;
    }
    removeComponent(component) {
        this.components = this.components.filter(item => item !== component)
        Pool.instance.returnElement(component)
    }
    addChild(gameObject) {
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
        let rad = this.transform.angle * 180 * Math.PI
        return rad
    }
    /**
     * @param {number} value
     */
    set x(value) {
        this.transform.position.x = value
    }
    /**
     * @param {number} value
     */
    set y(value) {
        this.transform.position.y = value
    }
    set z(value) {
        this.transform.position.z = value
    }
    setPosition(x, y, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    setPositionXZ(x, z = 0) {
        this.x = x
        this.z = z
    }
    onRender(){
        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];         
            if (element.enabled) {
                element.onRender();
            }
        }
    }
    update(delta) {
        super.update(delta);
        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];
            if(element.shouldBeRemoved){
                this.components.splice(i,1);
                continue;
            }
            if (element.enabled) {
                element.update(delta);
            }
        }

        for (let i = this.components.length - 1; i >= 0; i--) {
            const element = this.components[i];
            if(element.shouldBeRemoved){
                this.components.splice(i,1);
                continue;
            }
            if (element.enabled) {
                element.lateUpdate(delta);
            }
        }
    }
    enable() {
        this.enabled = true;
        this.isDestroyed = false;
        this.components.forEach(element => {
            element.enable();
        });
    }
    disable() {
        this.enabled = false;
        this.components.forEach(element => {
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

    removeChild(child) {

        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if (element.engineID == child.engineID) {
                this.children.splice(index, 1)
                break
            }

        }
    }
    setParent(newParent) {
        if (this.parent && this.parent != newParent) {
            this.parent.removeChild(this)
        }
        this.parent = newParent;
        this.getNewParent(newParent);

    }
    getNewParent(newParent) {

    }
    get destroyed() {
        return this.isDestroyed
    }
    get enabledAndAlive() {
        return this.enabled && !this.isDestroyed
    }
}