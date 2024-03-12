export default class Spring {
    private position: number = 0;
    private target: number = 0;
    private velocity: number = 0;
    private stiffness: number;
    private damping: number;
    private mass: number;

    constructor(stiffness: number = 250, damping: number = 15, mass: number = 1) {
        this.stiffness = stiffness;
        this.damping = damping;
        this.mass = mass;
    }

    setTarget(target: number): void {
        this.target = target;
    }

    setPosition(value: number): void {
        this.position = value;
    }

    update(deltaTime: number): void {
        const force = -this.stiffness * (this.position - this.target) - this.damping * this.velocity;
        const acceleration = force / this.mass;

        // Update velocity and position using the Verlet integration method
        this.velocity += acceleration * deltaTime;
        this.position += this.velocity * deltaTime;
    }

    getPosition(): number {
        return this.position;
    }
}