import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import AppSingleton from 'loggie/AppSingleton';
import Unit from '../system/unitGrid/Unit';
import UnitGridController from './UnitGridController';
import AssetLoaderService from '../../../../../src/grid/AssetLoadService';
import { ShapeEnum } from '../system/ShapeEnum';
import UnitHandView from '../view/UnitHandView';
import UnitGridView from '../view/UnitGridView';
export default class  GridInteractionController extends GameObject {
    private battlefieldView!: UnitGridView;
    private battlefieldController!: UnitGridController;

    private stashView!: UnitGridView;
    private stashController!: UnitGridController;

    private unitHandView!: UnitHandView;
 
    build(...data: any[]): void {
        super.build();

        console.log("MAKE THIS WORK")
        const shapes = AssetLoaderService.instance.shapes
        const building1 = new Unit(null, AssetLoaderService.instance.unitData[0], { x: -1, y: -1 }, shapes.get(ShapeEnum.Cross))
        const building2 = new Unit(null, AssetLoaderService.instance.unitData[4], { x: -1, y: -1 }, shapes.get(ShapeEnum.L))
        const building3 = new Unit(null, AssetLoaderService.instance.unitData[6], { x: -1, y: -1 }, shapes.get(ShapeEnum.LBlock))
        const building4 = new Unit(null, AssetLoaderService.instance.unitData[1], { x: -1, y: -1 }, shapes.get(ShapeEnum.J))
        const building5 = new Unit(null, AssetLoaderService.instance.unitData[2], { x: -1, y: -1 }, shapes.get(ShapeEnum.L))
        const building6 = new Unit(null, AssetLoaderService.instance.unitData[3], { x: -1, y: -1 }, shapes.get(ShapeEnum.O))
        const building7 = new Unit(null, AssetLoaderService.instance.unitData[5], { x: -1, y: -1 }, shapes.get(ShapeEnum.OneSlot))
        const building8 = new Unit(null, AssetLoaderService.instance.unitData[7], { x: -1, y: -1 }, shapes.get(ShapeEnum.T))
        const building9 = new Unit(null, AssetLoaderService.instance.unitData[8], { x: -1, y: -1 }, shapes.get(ShapeEnum.S))
        //const building10 = new Unit(null, AssetLoaderService.instance.unitData[9], { x: 14, y: 0 }, { matrix: [[true, false, true], [true, true, true]] })

        // this.uiInfo = this.addFromNew(UiText)
        // this.uiInfo.build({ fontSize: 32 })
        // this.uiInfo.textField.setText('INFO')

        // this.battlefieldView = this.addFromNew(UnitGridView)
        // this.battlefieldView.build();
        // this.battlefieldView.x = 150
        // this.battlefieldView.y = 50

        this.battlefieldController = new UnitGridController(this.battlefieldView, 18, 10, AssetLoaderService.instance.synergyTable)
        this.battlefieldController.onUpdateHolding.add(this.updateHoldingUnit.bind(this))
        this.battlefieldController.onDropHandUnit.add(this.dropHandUnit.bind(this))
        this.battlefieldController.refresh()


        // this.stashView = this.addFromNew(UnitGridView)
        // this.stashView.build();
        // this.stashView.x = 150
        // this.stashView.y = 600

        this.stashController = new UnitGridController(this.stashView, 18, 6, AssetLoaderService.instance.synergyTable)
        this.stashController.onUpdateHolding.add(this.updateHoldingUnit.bind(this))
        this.stashController.onDropHandUnit.add(this.dropHandUnit.bind(this))

        console.log('building1',building3)
        this.stashController.addUnit(building1.clone())
        this.stashController.addUnit(building2.clone())
        this.stashController.addUnit(building3.clone())
        this.stashController.addUnit(building3.clone())
        this.stashController.addUnit(building3.clone())
        this.stashController.addUnit(building4.clone())
        this.stashController.addUnit(building5.clone())
        this.stashController.addUnit(building5.clone())
        this.stashController.addUnit(building6.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building7.clone())
        this.stashController.addUnit(building8.clone())
        this.stashController.addUnit(building9.clone())
        this.stashController.addUnit(building9.clone())
        this.stashController.addUnit(building9.clone())
        this.stashController.addUnit(building9.clone())
        this.stashController.addUnit(building9.clone())
        this.stashController.refresh()

        // this.unitHandView = this.addFromNew(UnitHandView)
        // this.unitHandView.build();
       // this.scene.input.on('pointerup', this.onPointerUp.bind(this), this);
    }
    dropHandUnit(unit: Unit) {
        this.unitHandView.destroyView()
        this.unitHandView.removeHandUnit();
        this.battlefieldController.updateHoldingUnit(null)
        this.stashController.updateHoldingUnit(null)

    }
    updateHoldingUnit(unit: Unit) {
        this.unitHandView.drawUnit(unit)
        this.battlefieldController.updateHoldingUnit(unit)
        this.stashController.updateHoldingUnit(unit)
    }
    // onPointerUp(pointer: Phaser.Input.Pointer) {
    //     // Handle pointer release
    //     if (pointer.button > 0) {
    //         this.unitHandView.tryRotateUnity()
    //     }
    // }

   
    update(delta:number, unscaledTime:number){
        super.update(delta, unscaledTime);
        this.unitHandView.x = AppSingleton.globalPointer.x
        this.unitHandView.z =  AppSingleton.globalPointer.y
    }
}