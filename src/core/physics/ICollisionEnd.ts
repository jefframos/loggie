import GameObject from "../gameObject/GameObject";

export interface ICollisionEnd {
    onCollisionEnd(gameObject:GameObject):void;
}