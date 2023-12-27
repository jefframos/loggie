import Matter, { Body } from "matter-js";

import GameObject from "../gameObject/GameObject";
import PhysicsProperties from "../physics/PhysicsProperties";
import Utils from "../utils/Utils";
import Vector3 from "../gameObject/Vector3";

export default class PhysicsEntity extends GameObject {
    constructor() {
        super();
        this.rigidBody = null;
        this.type = null;
        this.autoSetAngle = true;
        this.appliedForce = new Vector3()
        this.friction = 0.1;
        this.latestAngle = 0;
    }

    get bodyID() {
        return this.rigidBody.id;
    }
    start() {
        super.start();
    }
    build() {
        super.build();
        this.physics = new PhysicsProperties();
    }
    setDebug(radius = 15, color = 0xFFFFFF) {

        //improve this debug to fit the body
        if (!this.debug) {
            this.debug = new PIXI.Graphics();
            this.debug.tint = color;
        }

        this.debug.clear();

        if (this.rigidBody) {

            if (this.rigidBody.circleRadius) {
                this.debug.lineStyle(1, 0xFFFFFF).drawCircle(0, 0, this.rigidBody.circleRadius)
            } else {
                let w = this.rigidBody.bounds.max.x - this.rigidBody.bounds.min.x
                let h = this.rigidBody.bounds.max.y - this.rigidBody.bounds.min.y
                this.debug.lineStyle(1, 0xFFFFFF).drawRect(this.rigidBody.bounds.min.x, this.rigidBody.bounds.min.y, w, h)
            }
        } else {
            this.debug.lineStyle(1, 0xFFFFFF).drawCircle(0, 0, radius)
        }
    }
    destroy() {
        super.destroy();

        if (this.view) {
            this.view.visible = false;
        }
    }
    buildRect(x, y, width, height, isStatic = false) {
        this.rigidBody = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.rigidBody.gameObject = this;
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;
        this.type = 'rect'

        this.engine.physics.addAgent(this)

        return this.rigidBody
    }
    buildVertices(x, y, vertices, isStatic = false) {
        this.rigidBody = Matter.Bodies.fromVertices(x, y, vertices, { isStatic: isStatic });
        this.rigidBody.gameObject = this;
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;
        this.type = 'rect'

        this.engine.physics.addAgent(this)

        return this.rigidBody
    }
    buildCircle(x, y, radius, isStatic = false) {
        this.rigidBody = Matter.Bodies.circle(x, y, radius, { isStatic: false, restitution: 1 });
        this.rigidBody.gameObject = this;
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;
        this.type = 'circle'

        this.engine.physics.addAgent(this)

        return this.rigidBody
    }
    applyForce(force) {
        if (!this.rigidBody) return;

        this.appliedForce.x = force.x
        this.appliedForce.y = force.z
    }
    applyVelocity(force) {
        Matter.Body.setVelocity(this.rigidBody, force)
    }
    update(delta) {

        super.update(delta);

        this.physics.update();


        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;

        if (this.autoSetAngle && this.physics.magnitude > 0) {
            this.transform.angle = Math.atan2(this.physics.velocity.z, this.physics.velocity.x);
        }
        if (this.physics.magnitude > 0) {
            this.latestAngle = this.transform.angle;
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
        this.physics.angle = this.transform.angle

        if (this.debug) {

            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.z
            this.debug.rotation = this.physics.angle

        }

    }
    get radius() {
        this.rigidBody.circleRadius;
    }
    set layerMask(value) {
        this.rigidBody.collisionFilter.mask = value;
    }
    set layerGroup(value) {
        this.rigidBody.collisionFilter.group = value;
    }
    set layerCategory(value) {
        this.rigidBody.collisionFilter.category = value;
    }

    get layerMask() {
        return this.rigidBody.collisionFilter.mask;
    }
    get layerGroup() {
        return this.rigidBody.collisionFilter.group;
    }
    get layerCategory() {
        return this.rigidBody.collisionFilter.category;
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
    set x(value) {
        Matter.Body.setPosition(this.rigidBody, { x: value, y: this.rigidBody.position.y })
        this.transform.position.x = this.rigidBody.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        this.transform.position.y = value;
    }
    /**
     * @param {number} value
     */
    set z(value) {
        Matter.Body.setPosition(this.rigidBody, { x: this.rigidBody.position.x, y: value })
        this.transform.position.z = this.rigidBody.position.y;
    }
}