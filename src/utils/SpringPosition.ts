export default class SpringPosition {
    private position = { x: 0, y: 0 };
    private target = { x: 0, y: 0 };
    private velocity = { x: 0, y: 0 };
    private stiffness: number;
    private damping: number;
    private mass: number;

    constructor(stiffness: number = 250, damping: number = 15, mass: number = 1) {
        this.stiffness = stiffness;
        this.damping = damping;
        this.mass = mass;
    }
    setTarget(x: number, y: number): void {
        this.target.x = x;
        this.target.y = y;
    }

    setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    getPosition(): any {
        return this.position;
    }

    update(deltaTime: number): void {
        const forceX = -this.stiffness * (this.position.x - this.target.x) - this.damping * this.velocity.x;
        const accelerationX = forceX / this.mass;

        // Update velocity and position using the Verlet integration method
        this.velocity.x += accelerationX * deltaTime;
        this.position.x += this.velocity.x * deltaTime;


        const forceY = -this.stiffness * (this.position.y - this.target.y) - this.damping * this.velocity.y;
        const accelerationY = forceY / this.mass;

        // Update velocity and position using the Verlet integration method
        this.velocity.y += accelerationY * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

}