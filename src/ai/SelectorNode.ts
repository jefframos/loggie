import BehaviorNode from "./BehaviourNode";

export default class SelectorNode extends BehaviorNode {
    constructor(private children: BehaviorNode[]) {
        super();
    }

    run(): boolean {
        for (const child of this.children) {
            if (child.run()) {
                return true;
            }
        }
        return false;
    }
}