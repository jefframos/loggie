import GameObject from "../gameObject/GameObject";

export interface ICollisionEnter {
    onCollisionEnter(gameObject:GameObject):void;
}