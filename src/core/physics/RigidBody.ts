import Matter, { Body } from "matter-js";
import * as PIXI from "pixi.js";

import PhysicsProperties from "../physics/PhysicsProperties";
import Utils from "../utils/Utils";
import Vector3 from "../gameObject/Vector3";
import BaseComponent from "../gameObject/BaseComponent";

export default class RigidBody extends BaseComponent{
    //public physics: PhysicsProperties = new PhysicsProperties();
    public body!: Body;
    public autoSetAngle: boolean = true;
    public appliedForce: Vector3 = new Vector3()
    public friction: number = 0.1;
    public latestAngle: number = 0;
    public physics: PhysicsProperties = new PhysicsProperties();;

    constructor() {
        super();
        this.autoSetAngle = true;
        this.appliedForce = new Vector3()
        this.friction = 0.1;
        this.latestAngle = 0;

        this.body = Matter.Bodies.circle(0,0, 50, { isStatic: false, restitution: 1 });
    }
 
    get bodyID() {
        return this.body.id;
    }
    get type(){
        return this.body.type;
    }
    start() {
    }
    build() {
        this.physics = new PhysicsProperties();
    }    
    destroy() {
        super.destroy();      
    }
    buildRect(x:number, y:number, width:number, height:number, isStatic = false) {
        this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.body.gameObject = this;
        this.gameObject.x = this.body.position.x;
        this.gameObject.z = this.body.position.y;

        this.loggie.physics.addAgent(this)

        return this.body
    }
    buildVertices(x:number, y:number, vertices:Matter.Vector[][], isStatic:boolean = false) {
        this.body = Matter.Bodies.fromVertices(x, y, vertices, { isStatic: isStatic });
        this.body.gameObject = this;
        this.gameObject.x = this.body.position.x;
        this.gameObject.z = this.body.position.y;

        this.loggie.physics.addAgent(this)

        return this.body
    }
    buildCircle(radius:number, isStatic = false) {
        this.body.circleRadius = radius
        this.body.gameObject = this;
        this.loggie.physics.addAgent(this)
        this.body.position.x = this.gameObject.x;
        this.body.position.y = this.gameObject.z;
        return this.body
    }
    applyForce(force:Vector3) {
        if (!this.body) return;

        this.appliedForce.x = force.x
        this.appliedForce.y = force.z
    }
    applyVelocity(force:Vector3) {
        Matter.Body.setVelocity(this.body, force)
    }
    update(delta:number) {

        super.update(delta);

        this.physics.update();

        this.gameObject.x = this.body.position.x;
        this.gameObject.z = this.body.position.y;

        if (this.autoSetAngle && this.physics.magnitude > 0) {
            this.gameObject.angle = Math.atan2(this.physics.velocity.z, this.physics.velocity.x);
        }
        if (this.physics.magnitude > 0) {
            this.latestAngle = this.gameObject.angle;
        }
        this.physics.unscaleVelocity.x = this.physics.velocity.x / delta;
        this.physics.unscaleVelocity.z = this.physics.velocity.z / delta;

        this.physics.force.x = this.physics.velocity.x + this.appliedForce.x
        this.physics.force.z = this.physics.velocity.z + this.appliedForce.z

        this.physics.force2D.x = this.physics.force.x
        this.physics.force2D.y = this.physics.force.z

        this.appliedForce.x = Utils.lerp(this.appliedForce.x, 0, this.friction);
        this.appliedForce.z = Utils.lerp(this.appliedForce.z, 0, this.friction);

        this.applyVelocity(this.physics.force2D);
        this.physics.angle = this.gameObject.angle

        if (this.debug) {

            this.debug.x = this.gameObject.x
            this.debug.y = this.gameObject.z
            this.debug.rotation = this.physics.angle

        }

    }
    set layerMask(value) {
        this.body.collisionFilter.mask = value;
    }
    set layerGroup(value) {
        this.body.collisionFilter.group = value;
    }
    set layerCategory(value) {
        this.body.collisionFilter.category = value;
    }
    
    get radius() {
        return this.body.circleRadius;
    }
    get layerMask() {
        return this.body.collisionFilter.mask;
    }
    get layerGroup() {
        return this.body.collisionFilter.group;
    }
    get layerCategory() {
        return this.body.collisionFilter.category;
    }
    get facing() {
        return this.physics.facing;
    }
    get facingVector() {
        return this.physics.facingVector;
    }
    get facingAngle() {
        return this.physics.facing > 0 ? Math.PI : 0;
    }
    get facingAngleBack() {
        return this.physics.facing < 0 ? Math.PI : 0;
    }
    /**
     * @param {number} value
     */
    set x(value:number) {
        Matter.Body.setPosition(this.body, { x: value, y: this.body.position.y })
        this.gameObject.x = this.body.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value:number) {
        this.gameObject.y = value;
    }
    /**
     * @param {number} value
     */
    set z(value:number) {
        Matter.Body.setPosition(this.body, { x: this.body.position.x, y: value })
        this.gameObject.z = this.body.position.y;
    }
}