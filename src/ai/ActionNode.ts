import BehaviorNode from "./BehaviourNode";

// Action node - represents a single behavior
export default class ActionNode extends BehaviorNode {
    constructor(private action: () => boolean) {
        super();
        
    }

    run(): boolean {
        return this.action();
    }
}