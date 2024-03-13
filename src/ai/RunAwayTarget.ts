import Eugine from "eugine/core/Eugine";
import Component from "eugine/core/components/Component";
import GameObject from "eugine/core/gameObject/GameObject";
import PhysicsGameObject from "eugine/core/physics/PhysicsGameObject";
import MathUtils from "eugine/core/utils/MathUtils";

export default class RunAwayTarget extends Component {

    targetSpeed: number = 0;
    currentSpeed: number = 0;
    maxSpeed: number = 0.1;
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }

    updateTarget(enemies: Array<PhysicsGameObject>, distance: number = 150) {

        const parent = this.gameObject as PhysicsGameObject;

        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)
        for (let index = enemies.length - 1; index >= 0; index--) {
            const element = enemies[index];
            if (parent != element) {

                var dist = Phaser.Math.Distance.Between(parent.physicsEntity.x + parent.latestDirection.x, parent.physicsEntity.y + parent.latestDirection.z, element.physicsEntity.x, element.physicsEntity.y);
                var angle = Phaser.Math.Angle.Between(parent.physicsEntity.y, parent.physicsEntity.x, element.physicsEntity.y, element.physicsEntity.x) - Math.PI;
                if (dist < distance) {
                    parent.velocityX = Math.sin(angle) * this.currentSpeed
                    parent.velocityY = Math.cos(angle) * this.currentSpeed

                    this.targetSpeed = this.maxSpeed;
                    break
                }
            }
        }

    }
    reset() {
        const parent = this.gameObject as PhysicsGameObject;
        parent.velocityX = 0;
        parent.velocityY = 0;
    }
}