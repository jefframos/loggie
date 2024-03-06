import GameObject from "../gameObject/GameObject";

export interface ICollisionStay {
    onCollisionStay(gameObject:GameObject):void;
}