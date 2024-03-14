import GameObject from "../gameObject/GameObject";
import RigidBody from "./RigidBody";

export interface ICollisionEnd {
    onCollisionEnd(gameObject:RigidBody):void;
}