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
import { RenderLayers } from "./RenderLayers";
import ScreenInfo from "../screen/ScreenInfo";

export default class RenderModule extends GameObject {

    public container: PIXI.Container;
    protected uiOverlay!: Overlay;
    protected views: Array<GameView>;

    public onNewRenderEntityAdded: signals.Signal;
    public onNewRenderEntityLateAdded: signals.Signal;

    public layers: Map<string, Layer>;
    private layersArray: Array<Layer> = []
    private unscrollableArray: Array<Layer> = []
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

        const layerEnum = Object.values(RenderLayers);
        
        for (const key in layerEnum) {
            const element = layerEnum[key];
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

        const overlayLayer = this.layers.get(RenderLayers.UILayerOverlay)
        if(overlayLayer){
            overlayLayer.scrollable = false;
            this.uiOverlay = new Overlay(overlayLayer.container);

        }

        this.renderStats = {
            totalRenderEntities: 0
        }

        GuiDebugger.instance.listenFolder('Render', this.renderStats)

        this.onNewRenderEntityAdded = new signals.Signal();
        this.onNewRenderEntityLateAdded = new signals.Signal();
        this.lateAdded = []
    }
    setCameraPivots(pivot:PIXI.Point){
        this.layersArray.forEach(element => {
            if(element.scrollable){
                element.container.pivot.x = pivot.x
                element.container.pivot.y = pivot.y
            }
        });
    }
    start() {
        this.loggie.entityAdded.add(this.newEntityAdded.bind(this))
        this.loggie.componentAdded.add(this.newComponentAdded.bind(this))
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);
        this.uiOverlay.update(delta, unscaledTime);
        this.container.x = ScreenInfo.gameWidth / 2;
        this.container.y = ScreenInfo.gameHeight / 2;

        this.uiOverlay.container.x = -this.container.x
        this.uiOverlay.container.y = -this.container.y
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
        if (gameView.layer == RenderLayers.UILayerOverlay) {
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
        if (gameView.layer == RenderLayers.UILayerOverlay) {
            this.uiOverlay.removeChild(gameView.view)

        } else if (gameView) {
            this.layers.get(gameView.layer)?.removeGameView(gameView)
        }

    }
    swapLayer(entity: GameView, layer: string) {
        this.layers.get(entity.layer)?.removeGameView(entity)
        this.layers.get(layer)?.addGameView(entity)
    }
    onRender() {
        this.layersArray.forEach(element => {
            element.onRender();
        });

        this.renderStats.totalRenderEntities = this.layers.get(RenderLayers.Gameplay)?.children.length;

        if (this.lateAdded.length) {
            this.onNewRenderEntityLateAdded.dispatch(this.lateAdded)
            this.lateAdded.length = 0;
        }
    }
}