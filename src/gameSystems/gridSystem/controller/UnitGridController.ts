
import UnitGrid from "../system/unitGrid/UnitGrid";
import Unit from "../system/unitGrid/Unit";
import { Signal } from "signals";
import { SynergyData } from "../system/unitGrid/SynergyData";
import UnitGridView from "../view/UnitGridView";

export default class UnitGridController {
    private unitGrid!: UnitGrid;
    private gridView!: UnitGridView;
    private holdingUnit!: Unit | null;
    public onUpdateHolding: Signal = new Signal();
    public onAskForHand: Signal = new Signal();
    public onDropHandUnit: Signal = new Signal();
    constructor(gridView: UnitGridView, i: integer = 8, j: integer = 8, synergyTable:SynergyData[]) {
        this.unitGrid = new UnitGrid(i, j, synergyTable)
        this.unitGrid.onSynergyUpdated.add(this.synergyUpdated.bind(this));
        this.gridView = gridView;
        this.gridView.drawGrid(this.unitGrid);
        this.gridView.onUpdateCursorPosition.add(this.updateCursorPosition.bind(this));
        this.gridView.onCursorUp.add(this.updateCursorUp.bind(this));
    }
    synergyUpdated() {
        this.gridView.setGridValue(this.unitGrid.totalValue)
    }
    addUnit(unit: Unit) {

        if (unit.position.x < 0 || unit.position.y < 0) {

            //this is the simple way to get next slot that will fit
            //this.unitGrid.findPositionForUnit(unit)
            const optimalPosition = this.unitGrid.findOptimalPositionForUnit(unit)

            if (optimalPosition) {
                console.log(optimalPosition?.rotation)
                unit.rotateTo(optimalPosition?.rotation)
                this.unitGrid.addUnit(unit, optimalPosition)
            } else {
                console.debug(`this ${unit.data.category_id} cant be placed here`)
            }
        } else {

            if (this.unitGrid.canPlaceUnit(unit)) {
                this.unitGrid.addUnit(unit)
            } else {
                console.debug(`this ${unit.data.category_id} cant be placed here: ${unit.position.x} , ${unit.position.y}`)
            }
        }
    }
    refresh() {
        this.gridView.destroyView();
        this.gridView.drawGrid(this.unitGrid)
    }
    updateCursorPosition(x: number, y: number) {
        const onBounds = this.unitGrid.isWithinBounds(x, y)
        if (onBounds) {
            this.gridView.showCursor();
        } else {
            this.gridView.hideCursor();
        }
    }
    updateCursorUp(x: number, y: number) {
        const onBounds = this.unitGrid.isWithinBounds(x, y)
        const gridPosition = { x, y }
        if (onBounds) {
            if (this.holdingUnit) {
                if (this.unitGrid.canPlaceUnit(this.holdingUnit, gridPosition)) {
                    this.unitGrid.addUnit(this.holdingUnit, gridPosition);
                    this.refresh();
                    this.onDropHandUnit.dispatch(this.holdingUnit);
                    this.holdingUnit = null;
                    return;
                } else {
                    const overlaps = this.unitGrid.getOverlappedUnits(this.holdingUnit, gridPosition)
                    if (overlaps.length == 1) {
                        const buildingCopy = overlaps[0]
                        this.unitGrid.addUnit(this.holdingUnit, gridPosition)
                        this.unitGrid.removeUnit(overlaps[0])
                        this.onUpdateHolding.dispatch(buildingCopy);
                        this.refresh();
                        return;
                    } else if (overlaps.length > 1) {
                        return;
                    }
                }
            }else{

                const unit = this.unitGrid.checkTile(gridPosition)
                
                if (unit) {
                    
                    this.unitGrid.removeUnit(unit);
                    this.refresh();
                    this.onUpdateHolding.dispatch(unit);
                }
            }
        }
    }
    updateHoldingUnit(unit: Unit | null) {
        this.holdingUnit = unit;
    }
}