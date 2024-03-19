import BehaviorNode from "./BehaviourNode";

// Define the node types
enum NodeType {
    Selector,
    Sequence,
    Action,
}
export default class BehaviourTree extends BehaviorNode {
    private children: BehaviorNode[] = [];
    constructor(children: BehaviorNode[] = []) {
        super();
        this.children = children;
    }
    setup(children: BehaviorNode[]) {
        this.children = children;
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