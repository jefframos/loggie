import GameObject from "../gameObject/GameObject";
import RigidBody from "./RigidBody";

export interface ICollisionStay {
    onCollisionStay(gameObject:RigidBody):void;
}