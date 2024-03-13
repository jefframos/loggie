import Eugine from "eugine/core/Eugine";
import GameObject from "eugine/core/gameObject/GameObject";
import WorldViewContainer from "eugine/entities/WorldViewContainer";
import Unit from "../../system/unitGrid/Unit";
import AssetLoaderService from "../../AssetLoaderService";
import TileView from "./TileView";

export default class UnitHandView extends WorldViewContainer {
    private tileSize: number = 50
    private tiles: TileView[] = [];
    private holdingUnit!:Unit | null;
    constructor(scene:Phaser.Scene, eugine:Eugine){
        super(scene, eugine);
    }
    build(...data: any[]): void {
        super.build(data);
    }

    drawUnit(unit:Unit){
        this.destroyView();

        this.holdingUnit = unit;
        for (let y = 0; y < unit.shape.matrix.length; y++) {
            for (let x = 0; x < unit.shape.matrix[y].length; x++) {
                const slot = unit.shape.matrix[y][x]
                if (!slot) continue
                const data = AssetLoaderService.instance.getUnitViewData(unit?.data);
                const tile = this.addFromPool(TileView) as TileView
                tile.build(data);
                tile.view.setTint(data?.color || 0x999999)
                tile.x = x * this.tileSize
                tile.z = y * this.tileSize
                tile.view.setDisplaySize(this.tileSize, this.tileSize)
                tile.view.alpha = 0.9
                this.tiles.push(tile)
            }
        }
      
    }
    removeHandUnit(){
        this.holdingUnit = null;
    }
    tryRotateUnity(){
        if(this.holdingUnit){

            this.holdingUnit?.rotateUnitClockwise();
            this.drawUnit(this.holdingUnit);
        }
    }
    destroyView() {
        this.tiles.forEach(element => {
            element.destroy();
        });
        this.tiles = [];
    }

}