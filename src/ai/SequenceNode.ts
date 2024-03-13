import BehaviorNode from "./BehaviourNode";

export default class SequenceNode extends BehaviorNode {
    constructor(private children: BehaviorNode[]) {
        super();
    }

    run(): boolean {
        for (const child of this.children) {
            if (!child.run()) {
                return false;
            }
        }
        return true;
    }
}