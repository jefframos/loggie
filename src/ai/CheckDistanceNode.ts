
import BehaviorNode from "./BehaviourNode";
import GameObject from "eugine/core/gameObject/GameObject";

export default class CheckDistanceNode extends BehaviorNode {
    constructor(private player: GameObject, private enemy: GameObject, private distanceThreshold: number) {
      super();
    }
  
    run(): boolean {
      const distance = Math.sqrt(
        Math.pow(this.player.x - this.enemy.x, 2) + Math.pow(this.player.y - this.enemy.y, 2)
      );
      return distance < this.distanceThreshold;
    }
  }