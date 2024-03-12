import * as PIXI from "pixi.js";

import GameObject from "../gameObject/GameObject";
import Layer from "../Layer";
import signals from "signals";
import Loggie from "../Loggie";
import GameView from "../view/GameView";
import BaseComponent from "../gameObject/BaseComponent";
import GuiDebugger from "../debug/GuiDebugger";
import Overlay from "../ui/Overlay";
import Pool from "../utils/Pool";

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
        Particles: 'particles',
        UILayer: '_g_UI',
        UILayerOverlay: '_u_UIOverlay'
    }
    protected container: PIXI.Container;
    protected uiOverlay: Overlay;
    protected views: Array<GameView>;

    public onNewRenderEntityAdded: signals.Signal;
    public onNewRenderEntityLateAdded: signals.Signal;

    public layers: Map<string, Layer>;
    private layersArray: Array<Layer> = []
    private lateAdded: Array<GameView> = []

    private renderStats: any;

    public get overlay(): Overlay {
        return this.uiOverlay;
    }
    constructor(container: PIXI.Container) {
        super();

        this.container = container;
       
        this.views = [];

        this.layers = new Map<string, Layer>();
        this.layersArray = [];
        for (const key in RenderModule.RenderLayers) {
            const element = RenderModule.RenderLayers[key];
            if (element.indexOf('_g_') >= 0) {
                continue
            }
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
            this.layers.set(element, layer);
            this.layersArray.push(layer)
        }

        const overlayLayer = this.layers.get(RenderModule.RenderLayers.UILayerOverlay)?.container
        if(overlayLayer){
            this.uiOverlay = new Overlay(overlayLayer);
        }

        this.renderStats = {
            totalRenderEntities: 0
        }
        //window.gameplayFolder.add(this.renderStats, 'totalRenderEntities').listen();

        GuiDebugger.instance.listenFolder('Render', this.renderStats)

        this.onNewRenderEntityAdded = new signals.Signal();
        this.onNewRenderEntityLateAdded = new signals.Signal();

        this.lateAdded = []


        //this.layers.get(RenderModule.RenderLayers.Shadow)?.container.tint = 0
        //this.layers.get(RenderModule.RenderLayers.Shadow)?.container.alpha = 0.1
    }
    start() {
        this.loggie.entityAdded.add(this.newEntityAdded.bind(this))
        this.loggie.componentAdded.add(this.newComponentAdded.bind(this))
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);
        this.uiOverlay.update(delta, unscaledTime);
    }
    newComponentAdded(entity: BaseComponent) {
        if (entity instanceof GameView) {
            this.addGameView(entity)
        }
    }
    newEntityAdded(entities: Array<GameObject>) {
        entities.forEach(element => {
            const gameView = element.findComponent(GameView) as GameView
            if (gameView) {
                this.addGameView(gameView)
            }

        });

    }
    addGameView(gameView: GameView) {
        gameView.gameObject.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
        gameView.onSwapLayer.addOnce(this.swapLayer.bind(this))
        if (gameView.layer == RenderModule.RenderLayers.UILayerOverlay) {
            this.uiOverlay.addChild(gameView.view)

        } else {
            this.layers.get(gameView.layer)?.addGameView(gameView)
            this.onNewRenderEntityAdded.dispatch(gameView);
        }
        this.lateAdded.push(gameView);
    }
    elementDestroyed(element: GameObject) {
        const gameView = element.findComponent(GameView) as GameView
        if (gameView) {
            this.removeView(gameView)
        }

    }
    removeView(gameView: GameView) {
        if (gameView.layer == RenderModule.RenderLayers.UILayerOverlay) {
            this.uiOverlay.removeChild(gameView.view)

        } else if (gameView) {
            console.log(gameView)
            console.log('elementDestroyed', gameView)
            this.layers.get(gameView.layer)?.removeGameView(gameView)

        }

    }
    swapLayer(entity: GameView, layer: string) {
        this.layers.get(entity.layer)?.removeGameView(entity)
        this.layers.get(layer)?.addGameView(entity)

        console.log(entity.layer, ' to' , layer)
    }
    onRender() {
        this.layersArray.forEach(element => {
            element.onRender();
        });

        this.renderStats.totalRenderEntities = this.layers.get(RenderModule.RenderLayers.Gameplay)?.children.length;

        if (this.lateAdded.length) {
            this.onNewRenderEntityLateAdded.dispatch(this.lateAdded)
            this.lateAdded.length = 0;
        }
    }
}