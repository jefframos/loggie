
import { Signal } from "signals";
import GameObject from "../gameObject/GameObject";
import Loggie from '../Loggie';
import Matter from "matter-js";
import RigidBody from "../physics/RigidBody";

export default class PhysicsModule extends GameObject {
    protected physicsEngine: Matter.Engine;
    public entityAdded: Signal = new Signal();
    public entityRemoved: Signal = new Signal();

    private nonStaticList: RigidBody[] = [];
    private collisionList: RigidBody[] = [];
    constructor() {
        super();

        this.physicsEngine = Matter.Engine.create({
            gravity: {
                scale: 10,
                x: 0,
                y: 0
            },
            // debug:true
        });

        // const render = Matter.Render.create({
        //     element: document.body,
        //     engine: this.physicsEngine,
        //     options: {
        //         width: 800,
        //         height: 600,
        //         showAngleIndicator: true, // Show angle indicators
        //         showCollisions: true,     // Show collision points
        //         showVelocity: true,       // Show velocity vectors
        //         wireframes: false,        // Set to true for wireframe rendering
        //     },
        // });
        // Matter.Render.run(render);

        this.nonStaticList = []
        this.collisionList = []


        this.physicsStats = {
            totalPhysicsEntities: 0
        }
        //window.gameplayFolder.add(this.physicsStats, 'totalPhysicsEntities').listen();

        // Matter.Events.on(this.physicsEngine, 'collisionActive ', (event:Matter.IEvent<Matter.Engine>) => {
        //     if(event?.source?.pairs){

        //         event?.source?.pairs.forEach((collision) => {
        //             var elementPosA = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyA.id);
        //             if (elementPosA >= 0) {
        //                 if (this.collisionList[elementPosA].collisionStay) {
        //                     this.collisionList[elementPosA].collisionStay(collision.bodyB.gameObject)
        //                 }
        //             }
        //             var elementPosB = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyB.id);
        //             if (elementPosB >= 0) {
        //                 if (this.collisionList[elementPosB].collisionStay) {
        //                     this.collisionList[elementPosB].collisionStay(collision.bodyA.gameObject)
        //                 }
        //             }
        //         });
        //     }
        // });
        Matter.Events.on(this.physicsEngine, 'collisionEnd', (event: Matter.IEventCollision<Matter.Engine>) => {
            event.pairs.forEach((collision) => {
                var elementPosA = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyA.id);
                if (elementPosA >= 0) {
                    if (this.collisionList[elementPosA].collisionExit) {
                        this.collisionList[elementPosA].collisionExit(collision.bodyB.gameObject)
                    }
                }
                var elementPosB = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyB.id);
                if (elementPosB >= 0) {
                    if (this.collisionList[elementPosB].collisionExit) {
                        this.collisionList[elementPosB].collisionExit(collision.bodyA.gameObject)
                    }
                }
            });
        });
        Matter.Events.on(this.physicsEngine, 'collisionStart', (event: Matter.IEventCollision<Matter.Engine>) => {
            event.pairs.forEach((collision) => {
                var elementPosA = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyA.id);
                if (elementPosA >= 0) {
                    if (this.collisionList[elementPosA].collisionEnter) {
                        this.collisionList[elementPosA].collisionEnter(collision.bodyB.gameObject)
                    }
                }
                var elementPosB = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyB.id);
                if (elementPosB >= 0) {
                    if (this.collisionList[elementPosB].collisionEnter) {
                        this.collisionList[elementPosB].collisionEnter(collision.bodyA.gameObject)
                    }
                }
            });
        });

    }
    addPhysicBody(physicBody: RigidBody) {
        console.log('physicBody', physicBody)
        if (physicBody.gameObject.collisionEnter || physicBody.gameObject.collisionExit || physicBody.gameObject.collisionStay) {
            this.collisionList.push(physicBody);
        }
        Matter.Composite.add(this.physicsEngine.world, physicBody.body);

        this.entityAdded.dispatch([physicBody])
    }
    destroyRandom(quant = 5) {
        for (let index = 0; index < quant; index++) {
            if (this.nonStaticList.length <= 0) return;

            this.removeAgent(this.nonStaticList[this.nonStaticList.length - 1]);
        }
    }

    removeAgent(agent: RigidBody) {
        Loggie.RemoveFromListById(this.nonStaticList, agent)
        Loggie.RemoveFromListById(this.collisionList, agent)
        Matter.World.remove(this.physicsEngine.world, agent.body)
    }

    addAgent(agent: RigidBody) {

        var elementIndex = this.collisionList.map(function (x) { return x.engineID; }).indexOf(agent.engineID);
        if (elementIndex >= 0) {
            //this avoid duplicated elements
            return
        }

        this.addPhysicBody(agent)
        if (!agent.body.isStatic) {
            this.nonStaticList.push(agent)
        }
    }
    update(delta:number) {
        delta *= Loggie.PhysicsTimeScale;
        super.update(delta)

        if (this.physicsEngine && delta) {
            Matter.Engine.update(this.physicsEngine, delta);
        }
        this.physicsStats.totalPhysicsEntities = this.physicsEngine.detector.bodies.length
    }

}