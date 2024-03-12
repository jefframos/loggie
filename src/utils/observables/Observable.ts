import { Signal } from "signals";

interface Observer {
    update(newValue: any): void;
}

type ObserverList = {
    observer: any,
    callback: (newValue: any, oldValue: any) => void
}
// Observable class
export default class Observable {
    private observers: ObserverList[] = [];
    protected value: any;
    public onUpdateValue: Signal = new Signal();
    // Constructor with an initial value
    constructor(initialValue: any) {
        this.value = initialValue;
    }

    // Getter for the value
    getValue(): any {
        return this.value;
    }

    resetValue(initialValue: any, callUpdate: boolean) {
        if (callUpdate) {
            this.onUpdateValue.dispatch(initialValue, this.value);
        }
        this.value = initialValue;
    }
    // Setter for the value, triggers notification to observers
    setValue(newValue: any): void {
        this.onUpdateValue.dispatch(newValue, this.value);
        this.value = newValue;
    }

    // Add an observer to the list
    addObserver(observer: any, callback: (newValue: any, oldValue: any) => void): void {
        this.observers.push({
            observer,
            callback
        });
        this.onUpdateValue.add(callback)
    }
    increment(value: number): void {
        if (isNaN(this.value)) {
            console.warn('value is not number');
            return;
        }
        this.setValue(this.getValue() + value);
    }
    // Remove an observer from the list
    removeObserver(observer: any): void {

        const obs = this.observers.find(item => item.observer !== observer)
        if (obs) {
            this.onUpdateValue.remove(obs.callback)
        }

        this.observers = this.observers.filter(item => item.observer !== observer);
    }

}