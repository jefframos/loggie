import { PhysicsLayers } from "./PhysicsLayers";

export enum PhysicsGroups {
    EnvironmentCollision = PhysicsLayers.Player | PhysicsLayers.Default | PhysicsLayers.Enemy | PhysicsLayers.Bullet,

    PlayerCollision = PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Enemy | PhysicsLayers.EnemyBullet && ~PhysicsLayers.Player,
    EnemyCollision = PhysicsLayers.Bullet | PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Player | PhysicsLayers.Sensor | PhysicsLayers.Enemy,

    BulletCollision = PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Enemy,
    EnemyBulletCollision = PhysicsLayers.Environment | PhysicsLayers.Default | PhysicsLayers.Player
}