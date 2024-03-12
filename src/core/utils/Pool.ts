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
    private pool: Map<string, any[]> = new Map();

    constructor(){
    }
    public reset() {
        this.pool = new Map();
    }
    public getElement(constructor: any): any {
        if (this.pool.has(constructor.name)) {
            let elements = this.pool.get(constructor.name);

            if (elements && elements.length > 0) {
                let element = elements.shift();
                return element;
            }
        } else {
            this.pool.set(constructor.name, []);
        }
        let newElement = new constructor();

        return newElement;

    }
    public getPool(constructor: any) {
        if (!this.pool.has(constructor.name)) {
            return []
        }

        return this.pool.get(constructor.name)
    }
    public returnElement(element: any) {
        if (!this.pool.has(element.constructor.name)) {
            this.pool.set(element.constructor.name, []);
        }
        this.pool.get(element.constructor.name)?.push(element)

    }
}