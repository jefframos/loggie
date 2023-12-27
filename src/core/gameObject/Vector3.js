export default class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(target) {
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
    static distance(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
    }
    static distanceX(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x));
    }
    static distanceZ(v1, v2) {
        return Math.sqrt((v1.z - v2.z) * (v1.z - v2.z));
    }
    static atan2XZ(v1, v2) {
        return Math.atan2(v1.z - v2.z, v1.x - v2.x)
    }
    static sum(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }
    static mult(v1, v2) {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z)
    }
    static XZtoXY(v1) {
        return new Vector3(v1.x, v1.z, 0)
    }
    static lerp(v1, v2, a) {

        return new Vector3(
            v1.x * (1 - a) + v2.x * a,
            v1.y * (1 - a) + v2.y * a,
            v1.z * (1 - a) + v2.z * a);

    }


}