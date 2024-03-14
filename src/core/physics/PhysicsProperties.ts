import Vector3 from "../gameObject/Vector3";

export default class PhysicsProperties {
    public density: number = 0.1;
    public angle: number = 0;
    public facing: number = 1;

    public facingVector: Vector3 = new Vector3();
    public velocity: Vector3 = new Vector3();
    public unscaleVelocity: Vector3 = new Vector3();
    public force: Vector3 = new Vector3();
    public force2D: Vector3 = new Vector3();
    constructor() {
        this.density = 0.1;
        this.angle = 0;
        this.facing = 1;

        this.facingVector = new Vector3();
        this.velocity = new Vector3();
        this.unscaleVelocity = new Vector3();
        this.force = new Vector3();
        this.force2D = new Vector3();

    }
    get magnitude() {
        {
            let sum = this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z;
            return Math.sqrt(sum);
        }
    }
    update() {
        if (this.velocity.x > 0.01) {
            this.facing = -1;
        } else if (this.velocity.x < -0.0) {
            this.facing = 1;
        }

        this.facingVector.x = this.facing;
    }
}