import GameObject from "../gameObject/GameObject";
import RigidBody from "./RigidBody";

export interface ICollisionEnter {
    onCollisionEnter(gameObject:RigidBody):void;
}