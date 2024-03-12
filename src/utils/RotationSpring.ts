export default class RotationSpring {
    private position: number = 0;
    private target: number = 0;
    private velocity: number = 0;
    private stiffness: number;
    private damping: number;
    private mass: number;
    private readonly twoPi: number = 2 * Math.PI;
  
    constructor(stiffness: number = 250, damping: number = 15, mass: number = 1) {
      this.stiffness = stiffness;
      this.damping = damping;
      this.mass = mass;
    }
  
    setTarget(target: number): void {
      this.target = target % this.twoPi; // Ensure target is within [0, 2π]
    }
  
    setPosition(value: number): void {
      this.position = value % this.twoPi; // Ensure position is within [0, 2π]
    }
  
    update(deltaTime: number): void {
      const force = -this.stiffness * (this.position - this.target) - this.damping * this.velocity;
      const acceleration = force / this.mass;
  
      // Update velocity and position using the Verlet integration method
      this.velocity += acceleration * deltaTime;
      this.position = (this.position + this.velocity * deltaTime) % this.twoPi;
    }
  
    getPosition(): number {
      return this.position;
    }
  }
  