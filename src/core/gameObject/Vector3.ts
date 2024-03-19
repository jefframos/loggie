export default class Vector3 {
    static get ZERO(){
        return new Vector3();
    }
    public x:number;
    public y:number;
    public z:number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(target:Vector3) {
        this.x = target.x;
        this.y = target.y;
        this.z = target.z;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
     // Method to calculate the dot product of two vectors
    dotProduct(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // Method to calculate the magnitude of the vector
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Method to calculate the square magnitude of the vector
    squareMagnitude(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // Method to calculate the length (same as magnitude) of the vector
    length(): number {
        return this.magnitude();
    }

    // Method to sum two vectors
    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    // Method to multiply two vectors (element-wise)
    multiply(other: Vector3): Vector3 {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    // Method to calculate the angle between two vectors (in radians)
    angle(other: Vector3): number {
        const dot = this.dotProduct(other);
        const magnitudeProduct = this.magnitude() * other.magnitude();
        return Math.acos(dot / magnitudeProduct);
    }
    normalize(): Vector3 {
        const mag = this.magnitude();
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }
    normalizedLength(): number {
        return this.normalize().magnitude();
    }
    static distance(v1:Vector3, v2:Vector3) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
    }
    static distanceX(v1:Vector3, v2:Vector3) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x));
    }
    static distanceZ(v1:Vector3, v2:Vector3) {
        return Math.sqrt((v1.z - v2.z) * (v1.z - v2.z));
    }
    static atan2XZ(v1:Vector3, v2:Vector3) {
        return Math.atan2(v1.z - v2.z, v1.x - v2.x)
    }
    static sum(v1:Vector3, v2:Vector3) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }
    static mult(v1:Vector3, v2:Vector3) {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z)
    }
    static XZtoXY(v1:Vector3) {
        return new Vector3(v1.x, v1.z, 0)
    }
    static lerp(v1:Vector3, v2:Vector3, a:number) {

        return new Vector3(
            v1.x * (1 - a) + v2.x * a,
            v1.y * (1 - a) + v2.y * a,
            v1.z * (1 - a) + v2.z * a);

    }


}