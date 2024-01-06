import Loggie from "../Loggie";

interface PoolType {
    [key: string]: any;
}
export default class Pool {
    static _instance: Pool;
    static get instance() {
        if (!Pool._instance) {
            Pool._instance = new Pool();
        }
        return Pool._instance;
    }
    private pool: PoolType = {};

    public reset() {
        this.pool = {};
    }
    public getElement(constructor: any): any {
        if (this.pool[constructor.name]) {
            let elements = this.pool[constructor.name];

            if (elements.length > 0) {
                let element = elements.shift();
                return element;
            }
        } else {
            this.pool[constructor.name] = []
        }

        let newElement = new constructor();

        return newElement;

    }
    public getPool(constructor: any) {
        if (!this.pool[constructor.name]) {
            return []
        }

        return this.pool[constructor.name]
    }
    public returnElement(element: any) {
        if (!this.pool[element.constructor.name]) {
            this.pool[element.constructor.name] = []
        }
        this.pool[element.constructor.name].push(element)
    }
}