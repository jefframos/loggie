import GameObject from "../gameObject/GameObject";
import Layer from "../Layer";
import PhysicsModule from "./PhysicsModule";
import signals from "signals";

export default class RenderModule extends GameObject {
    static RenderLayers = {
        BaseB: '_p__u_baseb',
        Base: '_u_base',
        Debug: '_u_debug',
        Shadow: '_u__p_shadow',
        Default: '_n_default',
        Floor: '_p_floor',
        Building: 'building',
        BackLayer: '_u_back',
        Gameplay: '_u_gameplay',
        Light: '_u_light',
        FrontLayer: '_u_front',
        Particles: 'particles'
    }
    static UILayer = 'UI';
    static UILayerOverlay = 'UIOverlay';
    constructor(container, uiContainer, uiOverlay) {
        super();

        this.container = container;
        this.uiContainer = uiContainer;
        this.uiOverlay = uiOverlay;

        this.views = [];

        this.layers = {};
        this.layersArray = [];
        for (const key in RenderModule.RenderLayers) {
            const element = RenderModule.RenderLayers[key];
            let container = null;
            let sortable = element.indexOf('_n_') < 0;
            let cameraUpdate = element.indexOf('_u_') >= 0;
            if (element.indexOf('_p_') >= 0) {
                container = new PIXI.ParticleContainer(800, { tint: true });
                sortable = false;
            } else {
                container = new PIXI.Container()
            }

            let layer = new Layer(element, container, sortable)
            layer.cameraUpdate = cameraUpdate;
            this.container.addChild(layer.container)
            this.layers[element] = layer;
            this.layersArray.push(layer)
        }

        this.renderStats = {
            totalRenderEntities: 0
        }
        window.gameplayFolder.add(this.renderStats, 'totalRenderEntities').listen();

        this.onNewRenderEntityAdded = new signals.Signal();
        this.onNewRenderEntityLateAdded = new signals.Signal();
    
        this.lateAdded = []
        this.layers[RenderModule.RenderLayers.Shadow].container.tint = 0
        this.layers[RenderModule.RenderLayers.Shadow].container.alpha = 0.1
    }    
    start() {
        this.physics = this.engine.findByType(PhysicsModule)
        this.engine.entityAdded.add(this.newEntityAdded.bind(this))
    }
    newEntityAdded(entities) {
        entities.forEach(element => {
            if (element.gameView) {

                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                if (element.gameView.layer == RenderModule.UILayer) {
                    this.uiContainer.addChild(element.gameView.view)

                } else if (element.gameView.layer == RenderModule.UILayerOverlay) {
                    this.uiOverlay.addChild(element.gameView.view)

                } else {
                    this.layers[element.gameView.layer].addGameView(element.gameView)
                    this.onNewRenderEntityAdded.dispatch(element);
                }

                this.lateAdded.push(element);


            }
            if (element.debug) {
                this.layers[RenderModule.RenderLayers.Debug].addChild(element.debug)
            }

        });

    }
    elementDestroyed(element) {
        if (element.gameView.layer == RenderModule.UILayer) {
            this.uiContainer.removeChild(element.gameView.view)

        } else if (element.gameView.layer == RenderModule.UILayerOverlay) {
            this.uiOverlay.removeChild(element.gameView.view)

        } else if (element.gameView) {
            this.layers[element.gameView.layer].removeGameView(element.gameView)

        }
        //????????? why did i commented this?
        //Engine.RemoveFromListById(this.layers[element.gameView.layer].children, element.gameView.view)

        if (element.debug) {
            this.layers[RenderModule.RenderLayers.Debug].removeChild(element.debug)
        }
    }
    swapLayer(entity, layer) {

        if( entity.layer == layer){
            return;
        }
        
        this.layers[entity.layer].removeGameView(entity)
        this.layers[layer].addGameView(entity)

        entity.layer = layer;
    }
    onRender() {
        if (!this.physics) return

        this.layersArray.forEach(element => {
            element.onRender();
        });

        this.renderStats.totalRenderEntities = this.layers[RenderModule.RenderLayers.Gameplay].children.length;

        if (this.lateAdded.length) {
            this.onNewRenderEntityLateAdded.dispatch(this.lateAdded)
            this.lateAdded.length = 0;
        }
    }
}