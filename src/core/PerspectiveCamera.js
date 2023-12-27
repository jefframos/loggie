import * as PIXI from 'pixi.js';

import Camera from './Camera';
import Game from '../../Game';
import LightSource from './view/LightSource';
import Player from '../entity/Player';
import RenderModule from './modules/RenderModule';
import utils from '../../utils';

export default class PerspectiveCamera extends Camera {
    constructor() {
        super()
        this.cam = {
            x: 0, y: 250, z: 0, aspec: 1, fov: 5, near: 0, far: 20000
        }
        for (const key in this.cam) {
            if (Object.hasOwnProperty.call(this.cam, key)) {
                //window.GUI.add(this.cam, key).listen();
            }
        }
       
        window.GUI.add(this, 'targetZoom', 0.5, 3).listen();
    }
    start() {
        this.renderModule = this.engine.findByType(RenderModule);
        this.renderModule.onNewRenderEntityAdded.add(this.entityAdded.bind(this));
        this.renderModule.onNewRenderEntityLateAdded.add(this.entityLateAdded.bind(this));
    }
    update(delta) {
        super.update(delta);

        if (this.followPoint) {
            if (utils.distance(this.renderModule.container.pivot.x, this.renderModule.container.pivot.y, this.followPoint.x, this.followPoint.z) > 30) {

                let angle = Math.atan2(this.renderModule.container.pivot.y - this.followPoint.z,
                    this.renderModule.container.pivot.x - this.followPoint.x)
            } else {

            }
            this.renderModule.container.pivot.x = utils.lerp(this.renderModule.container.pivot.x, this.followPoint.x, 0.1)
            this.renderModule.container.pivot.y = utils.lerp(this.renderModule.container.pivot.y, this.followPoint.z, 0.1)

            Camera.Zoom = utils.lerp(Camera.Zoom, this.targetZoom, 0.01 * delta*60)

            this.renderModule.container.scale.set(Camera.Zoom);

        }
    }
    setFollowPoint(followPoint) {
        this.followPoint = followPoint;

    }
    snapFollowPoint() {
        this.renderModule.container.pivot.x = this.followPoint.x
        this.renderModule.container.pivot.y = this.followPoint.z
    }
    entityLateAdded(entityList) {
        entityList.forEach(entity => {
            this.entityAdded(entity);
            
        });
    }
    entityAdded(entity) {
        if (entity.gameView.layer != RenderModule.RenderLayers.Gameplay &&
            entity.gameView.layer != RenderModule.RenderLayers.Default) return;

        entity.gameView.view.x = entity.transform.position.x + entity.viewOffset.x
        entity.gameView.view.y = entity.transform.position.z + entity.viewOffset.y + entity.transform.position.y
    }
    onRender() {

        for (const key in this.renderModule.layers) {
            if (Object.hasOwnProperty.call(this.renderModule.layers, key)) {
                const layer = this.renderModule.layers[key];
                if (layer.cameraUpdate) {
                    layer.gameViews.forEach(element => {
                    
                        if (element.gameObject) {
                            element.view.x = element.gameObject.transform.position.x + element.viewOffset.x
                            element.view.y = element.gameObject.transform.position.z + element.viewOffset.y + element.gameObject.transform.position.y                           
                        }
                    });
                }
            }
        }
    }

    //TODO: the perspective is disabled for now
    transformView(gameView) {
        //console.log(gameView.gameObject)
        // let camM = [1, 0, 0, 0,
        //     0, 1, 0, 0,
        //     0, 0, 1, 0,
        //     this.cam.x, this.cam.y, this.cam.z, 0]
        var projectionMatrix = this.perspective(this.cam.fov, this.cam.aspec, this.cam.near, this.cam.far)

        var somePoint = [gameView.gameObject.transform.position.x + this.cam.x, this.cam.y, gameView.gameObject.transform.position.y + this.cam.z];
        var projectedPoint = this.transformPoint(projectionMatrix, somePoint);

        var screenX = (projectedPoint[0] * 0.5 + 0.5) * config.width * 0.5
        var screenZ = (projectedPoint[1] * -0.5 + 0.5) * config.height * 0.5

        gameView.cameraOffset.x = screenX - gameView.gameObject.transform.position.x
        gameView.cameraOffset.y = screenZ - gameView.gameObject.transform.position.y

    }
    transformPoint(m, v) {
        var x = v[0];
        var y = v[1];
        var z = v[2];
        var w = x * m[0 * 4 + 3] + y * m[1 * 4 + 3] + z * m[2 * 4 + 3] + m[3 * 4 + 3];
        return [(x * m[0 * 4 + 0] + y * m[1 * 4 + 0] + z * m[2 * 4 + 0] + m[3 * 4 + 0]) / w,
        (x * m[0 * 4 + 1] + y * m[1 * 4 + 1] + z * m[2 * 4 + 1] + m[3 * 4 + 1]) / w,
        (x * m[0 * 4 + 2] + y * m[1 * 4 + 2] + z * m[2 * 4 + 2] + m[3 * 4 + 2]) / w, w];
    }
    perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
        dst = dst || new Float32Array(16);

        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
        var rangeInv = 1.0 / (zNear - zFar);

        dst[0] = f / aspect;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;

        dst[4] = 0;
        dst[5] = f;
        dst[6] = 0;
        dst[7] = 0;

        dst[8] = 0;
        dst[9] = 0;
        dst[10] = (zNear + zFar) * rangeInv;
        dst[11] = -1;

        dst[12] = 0;
        dst[13] = 0;
        dst[14] = zNear * zFar * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }
}