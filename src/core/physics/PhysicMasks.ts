import { PhysicsLayers } from "./PhysicsLayers";

export enum PhysicMasks {
    EnvironmentCollision = PhysicsLayers.Player | PhysicsLayers.Default | PhysicsLayers.Enemy | PhysicsLayers.Bullet,

    PlayerCollision = PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Enemy | PhysicsLayers.EnemyBullet | ~PhysicsLayers.Player,
    EnemyCollision = PhysicsLayers.Bullet | PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Player | PhysicsLayers.Sensor | PhysicsLayers.Enemy,

    BulletCollision = PhysicsLayers.Environment | PhysicsLayers.Enemy,
    EnemyBulletCollision = PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Player
}