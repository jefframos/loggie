import Matter, { Body } from "matter-js";
import * as PIXI from "pixi.js";

import PhysicsProperties from "../physics/PhysicsProperties";
import Utils from "../utils/Utils";
import Vector3 from "../gameObject/Vector3";
import BaseComponent from "../gameObject/BaseComponent";
import MathUtils from "loggie/utils/MathUtils";

export default class RigidBody extends BaseComponent {
    //public physics: PhysicsProperties = new PhysicsProperties();
    public body!: Body;
    public autoSetAngle: boolean = true;
    public appliedForce: Vector3 = new Vector3()
    public targetVelocity: Vector3 = new Vector3()
    public inverseForce: Vector3 = new Vector3()
    public friction: number = 0.1;
    public latestAngle: number = 0;
    public latestPosition: Vector3 = new Vector3();
    public positionDiff: Vector3 = new Vector3();
    public physics: PhysicsProperties = new PhysicsProperties();;

    constructor() {
        super();
        this.physics = new PhysicsProperties();

        this.autoSetAngle = true;
        this.appliedForce = new Vector3()
        this.friction = 0.1;
        this.latestAngle = 0;

        this.body = Matter.Bodies.circle(0, 0, 50, { isStatic: false, restitution: 0.5 });
        this.body.mass = 5
    }

    get bodyID() {
        return this.body.id;
    }
    get type() {
        return this.body.type;
    }
    start() {
    }
    enable() {
        this.targetVelocity.x = 0;
        this.targetVelocity.y = 0;
        this.targetVelocity.z = 0;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.physics.reset()
    }
    destroy() {
        super.destroy();
    }
    setSensor(value:boolean){
        this.body.isSensor = value;
    }
    setStatic(value:boolean){
        this.body.isStatic = value;
    }
    resetPosition(){
        
       
        // Body.setAngularSpeed(this.body,0)
        // Body.setPosition(this.body,{x:0, y:0})
        // Body.setSpeed(this.body,0)
        // Body.setAngle(this.body,0)
        // Body.setAngularVelocity(this.body,0)
        this.x = this.gameObject.transform.position.x;
        this.z = this.gameObject.transform.position.z;
    }
    buildRect(x: number, y: number, width: number, height: number, isStatic = false, isSensor: boolean = false) {
        this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.body.gameObject = this;
        // this.gameObject.x = this.body.position.x;
        // this.gameObject.z = this.body.position.y;
        this.body.isStatic = isStatic;
        this.body.isSensor = isSensor;
        this.loggie.physics.addAgent(this)
        this.resetPosition();
        return this.body
    }
    buildVertices(x: number, y: number, vertices: Matter.Vector[][], isStatic: boolean = false, isSensor: boolean = false) {
        this.body = Matter.Bodies.fromVertices(x, y, vertices, { isStatic: isStatic });
        this.body.gameObject = this;
        // this.gameObject.x = this.body.position.x;
        // this.gameObject.z = this.body.position.y;
        this.body.isStatic = isStatic;
        this.body.isSensor = isSensor;
        this.loggie.physics.addAgent(this)        
        this.resetPosition();
        return this.body
    }
    buildCircle(radius: number, isStatic = false, isSensor: boolean = false) {
        const scale = radius / (this.body.circleRadius || radius);
        Matter.Body.scale(this.body, scale, scale);
        this.body.gameObject = this;
        // this.body.position.x = this.gameObject.x;
        // this.body.position.y = this.gameObject.z;
        this.body.isStatic = isStatic;
        this.body.isSensor = isSensor;
        this.loggie.physics.addAgent(this)
        this.resetPosition();
        return this.body
    }
    scaleToRadius(radius: number){
        const scale = radius / (this.body.circleRadius || radius);
        Matter.Body.scale(this.body, scale, scale);
        this.body.circleRadius = radius;
    }
    applyForce(force: Vector3) {
        if (!this.body) return;

        this.appliedForce.x = force.x
        this.appliedForce.y = force.z
    }
    applyVelocity(force: Vector3) {
       // Matter.Body.applyForce(this.body, this.body.position, force)
        Matter.Body.setVelocity(this.body, force)
        Matter.Body.setAngularVelocity(this.body, 0)

        //Matter.Body.rotate(this.body, 0)
            //this.body.angle = 0//this.gameObject.transform.angle
            //Matter.Body.setAngularVelocity(this.body,0)
    }

    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);


        if(this.targetVelocity.x !== undefined){

            this.velocityX = this.targetVelocity.x + this.inverseForce.x
        }
        if(this.targetVelocity.z !== undefined){
            this.velocityY = this.targetVelocity.z + this.inverseForce.z
        }
        
        this.inverseForce = Vector3.lerp(this.inverseForce, Vector3.ZERO, 0.1)
        
        this.positionDiff.x = this.gameObject.transform.position.x - this.latestPosition.x
        this.positionDiff.z = this.gameObject.transform.position.z - this.latestPosition.z
        
        this.physics.update();
        
        this.gameObject.x = this.body.position.x;
        this.gameObject.z = this.body.position.y;
        
        if (this.autoSetAngle && this.physics.magnitude > 0) {
            this.gameObject.transform.angle = Math.atan2(this.physics.velocity.z, this.physics.velocity.x);
            //this.gameObject.transform.angle = Math.atan2(this.positionDiff.z, this.positionDiff.x);
        }
        if (this.physics.magnitude > 0) {
            this.latestAngle = this.gameObject.transform.angle;
            this.gameObject.transform.lookDirection.x = this.targetVelocity.x
            this.gameObject.transform.lookDirection.z = this.targetVelocity.z
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
        this.physics.angle = this.gameObject.transform.angle

       
    }
    public lateUpdate(delta: number, unscaledDelta: number): void {
        super.lateUpdate(delta, unscaledDelta)
        this.latestPosition.x = this.gameObject.transform.position.x;
        this.latestPosition.y = this.gameObject.transform.position.y;
        this.latestPosition.z = this.gameObject.transform.position.z;
    }
    set velocityX(value: number) {
        this.physics.velocity.x = value;
    }
    set velocityY(value: number) {
        this.physics.velocity.z = value;
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
    set x(value: number) {
        Matter.Body.setPosition(this.body, { x: value, y: this.body.position.y })
        this.gameObject.x = this.body.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value: number) {
        this.gameObject.y = value;
    }
    /**
     * @param {number} value
     */
    set z(value: number) {
        Matter.Body.setPosition(this.body, { x: this.body.position.x, y: value })
        this.gameObject.z = this.body.position.y;
    }
}