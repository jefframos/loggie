export enum PhysicsLayers {
    Nothing = 0,
    Everything = 1,
    Default = 2,
    Player = 1 << 1,
    Enemy = 1 << 2,
    Environment = 1 << 3,
    Bullet = 1 << 4,
    Sensor = 1 << 5,
    FlightCompanion = 1 << 6,
    EnemyBullet = 1 << 7,
}