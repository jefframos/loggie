import BaseComponent from 'loggie/core/gameObject/BaseComponent';
import Animator from '../../../src/assets/Animator';
import RigidBody from 'loggie/core/physics/RigidBody';
export default class AutoAnimate2States extends BaseComponent {
    private animator!: Animator;
    private rigidBody!: RigidBody;

    constructor() {
        super()
    }
    build(data: any[]) {
        super.build();        
        this.rigidBody = data[0];
        this.animator = data[1];
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);

        if (this.animator && this.rigidBody) {
            if(this.rigidBody.physics.velocity.normalizedLength()){
             //console.log(this.rigidBody.physics.velocity.normalize())   
            }
            if(this.rigidBody.physics.velocity.normalizedLength() > 0.5){
                this.animator.play('walk')
            }else{
                this.animator.play('idle')
            }
        }
    }
}