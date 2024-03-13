import Eugine from "eugine/core/Eugine";
import GameObject from "eugine/core/gameObject/GameObject";
import BaseUiContainer from "eugine/core/ui/BaseUiContainer";
import UnitGrid from "../../system/unitGrid/UnitGrid";
import AssetLoaderService from "../../AssetLoaderService";
import WorldViewContainer from "eugine/entities/WorldViewContainer";
import TileView from "./TileView";
import Unit from "../../system/unitGrid/Unit";
import { Signal } from "signals";
import { UnitViewData } from "../../system/UnitViewData";

export default class UnitGridView extends WorldViewContainer {
    private mainContainer!: WorldViewContainer;
    private mapContainer!: WorldViewContainer;
    private tileSize: number = 50
    private tiles: TileView[] = [];
    private tileOver!: { x: number, y: number }
    private over!: TileView;
    private info!: Phaser.GameObjects.Text;

    public onUpdateCursorPosition: Signal = new Signal();
    public onCursorUp: Signal = new Signal();

    public set x(value: number) {
        this.mainContainer.x = value;
    }
    public set y(value: number) {
        this.mainContainer.z = value;
    }
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }
    build(...data: any[]): void {
        super.build(data);

        this.mainContainer = this.addFromNew(WorldViewContainer);
        this.mainContainer.build();
        this.addChild(this.mainContainer)

        this.mapContainer = this.addFromNew(WorldViewContainer);
        this.mapContainer.build();
        this.mainContainer.addChild(this.mapContainer)

        this.over = this.addFromPool(TileView) as TileView
        this.over.build();
        this.over.view.setTint(0xFF0000)
        this.over.view.alpha = 0.5
        this.over.view.setDisplaySize(this.tileSize, this.tileSize)


        this.info = this.scene.add.text(0, 0, '0')

        this.mainContainer.addChild(this.over)
        this.scene.input.on('pointerup', this.onPointerUp.bind(this), this);
    }
    onPointerUp(pointer: Phaser.Input.Pointer) {
        if (pointer.button > 0) {
            return;
        }
        this.onCursorUp.dispatch(this.tileOver.x, this.tileOver.y);
    }
    drawGrid(unitGrid: UnitGrid) {
        for (let y = 0; y < unitGrid.grid.length; y++) {
            for (let x = 0; x < unitGrid.grid[y].length; x++) {
                const unit = unitGrid.grid[y][x].unit;
                const data = AssetLoaderService.instance.getUnitViewData(unit?.data);
                const tile = this.addFromPool(TileView) as TileView
                tile.build(data, unit?.getRelativeTileSynergy(x, y));
                tile.view.setTint(data?.color || 0x999999)
                tile.x = x * this.tileSize
                tile.z = y * this.tileSize
                tile.view.setDisplaySize(this.tileSize, this.tileSize)
                tile.view.alpha = 0.9
                this.tiles.push(tile)
                this.mapContainer.addChild(tile)
            }
        }
    }


    destroyView() {
        this.tiles.forEach(element => {
            element.destroy();
        });
        this.tiles = [];
    }
    showCursor() {
        this.over.view.setVisible(true)
    }
    hideCursor() {
        this.over.view.setVisible(false)
    }

    update(delta: number, time: number): void {
        super.update(delta, time)

        const next = this.screenToTileCoordinates(this.scene.input.activePointer.x + this.tileSize / 2, this.scene.input.activePointer.y + this.tileSize / 2)
        if (this.tileOver != next) {
            this.onUpdateCursorPosition.dispatch(next.x, next.y)
        }
        this.tileOver = next;
        this.over.x = this.tileOver.x * this.tileSize - this.mainContainer.x
        this.over.z = this.tileOver.y * this.tileSize - this.mainContainer.z

        this.over.view.setDepth(50000)

        this.info.x = this.mainContainer.x
        this.info.y = this.mainContainer.z - 50
    }
    setGridValue(value: number) {
        this.info.setText(value.toFixed(1).toString());
    }
    screenToTileCoordinates(screenX: number, screenY: number): { x: number; y: number } {
        const loc = this.mapContainer.view.getLocalPoint(screenX, screenY)
        const tileX = Math.floor(loc.x / this.tileSize);
        const tileY = Math.floor(loc.y / this.tileSize);
        return { x: tileX, y: tileY };
    }
}