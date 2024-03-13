import Unit from './Unit';
import { UnitPosition } from './UnitPosition';
import GridTile from './GridTile';
import GridUtils from './GridUtils';
import SynergyCalculator from './SynergyCalculator';
import { SynergyData } from './SynergyData';
import { UnitShape } from './UnitShape';
import { Signal } from 'signals';
import { RotationAngle } from './RotationAngle';

export default class UnitGrid {
    public grid: GridTile[][] = []; // 2D array representing the grid
    private units: Unit[]; // List of buildings
    private synergyCalculator: SynergyCalculator;
    public totalValue: number = 0;
    public onSynergyUpdated: Signal = new Signal();
    constructor(public width: number, public height: number, synergyData: SynergyData[]) {
        this.synergyCalculator = new SynergyCalculator(synergyData);
        // Initialize the grid with empty tiles
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = new GridTile({ x, y }, null); // Default category
            }
        }
        this.units = [];
    }
    // Check if a building shape can be placed at a given position
    canPlaceUnit(unit: Unit, positionOverride: UnitPosition | null = null): boolean {
        const { shape } = unit;

        const position = positionOverride ? positionOverride : unit.position
        // Check if the shape fits within the bounds of the grid
        for (let y = 0; y < shape.matrix.length; y++) {
            for (let x = 0; x < shape.matrix[y].length; x++) {
                const cellOccupied = shape.matrix[y][x];
                const cellX = position.x + x;
                const cellY = position.y + y;
                // Check if the cell is within the grid bounds
                if (cellX < 0 || cellX >= this.width || cellY < 0 || cellY >= this.height) {
                    return false;
                }
                // Check if the cell is occupied by another building
                if (cellOccupied && this.grid[cellY][cellX].unit) {
                    return false;
                }
            }
        }

        return true;
    }
    getOverlappedUnits(unit: Unit, positionOverride: UnitPosition | null): Unit[] {
        return this.getOverlappedByShapeUnits(unit.shape, positionOverride ? positionOverride : unit.position)
    }
    getOverlappedByShapeUnits(shape: UnitShape, positionOverride: UnitPosition): Unit[] {
        const position = positionOverride
        const units: Unit[] = [];
        for (let y = 0; y < shape.matrix.length; y++) {
            for (let x = 0; x < shape.matrix[y].length; x++) {
                const cellOccupied = shape.matrix[y][x];
                const cellX = position.x + x;
                const cellY = position.y + y;
                // Check if the cell is within the grid bounds
                if (cellX < 0 || cellX >= this.width || cellY < 0 || cellY >= this.height) continue
                // Check if the cell is occupied by another building
                if (cellOccupied && this.grid[cellY][cellX].unit) {
                    if (!units.includes(this.grid[cellY][cellX].unit)) {
                        units.push(this.grid[cellY][cellX].unit)
                    }
                }
            }
        }
        return units;
    }
    updateTiles() {
        this.units.forEach(element => {
            element.resetSynergy()
        });
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const tile = this.grid[y][x];
                let synergyFactor = 1; // Default synergy factor
                let currencyGenerationRate = 1; // Default currency generation rate

                // Get neighboring tiles
                const neighbors = this.getNeighborTiles(tile.position);

                // Calculate synergy factor based on neighboring tiles
                for (const neighbor of neighbors) {
                    if (!this.isWithinBounds(neighbor.x, neighbor.y)) continue;
                    const neighborTile = this.grid[neighbor.y][neighbor.x];
                    if (tile.unit && neighborTile.unit) {
                        const synergy = this.synergyCalculator.calculateSynergy(tile.unit?.data.category_id, neighborTile.unit?.data.category_id);
                        if (synergy != 1) {
                            const unit = this.getOverlappedByShapeUnits({ matrix: [[true]] }, { x, y })
                            unit[0].applySynergy(x - unit[0].position.x, y - unit[0].position.y, synergy)
                        }
                        synergyFactor *= synergy;
                    }
                }

                // Update currency generation rate based on synergy factor
                // Example: Adjust currency generation rate based on synergy factor and other factors
                currencyGenerationRate *= synergyFactor;

                // Update the tile's currency generation rate and other properties
                // Example: tile.currencyGenerationRate = curre
            }
        }

        this.totalValue = 0;
        this.units.forEach(element => {
            this.totalValue += element.synergySum
        });

        this.onSynergyUpdated.dispatch();
    }
    getNeighborTiles(position: UnitPosition): UnitPosition[] {
        const neighbors: UnitPosition[] = [];
        const around = GridUtils.get4NeighborTiles(position, this.grid.length, this.grid[0].length);
        around.forEach(element => {
            neighbors.push({ ...element })
        });

        return neighbors;
    }

    checkTile(pos: { x: number, y: number }) {
        if (this.isWithinBounds(pos.x, pos.y)) {
            return this.grid[pos.y][pos.x].unit
        }

    }
    isWithinBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length;
    }

    // Add a building to the city
    addUnit(unit: Unit, positionOverride: UnitPosition | null = null) {
        const { shape } = unit;

        if (unit.parentGrid != this) {
            unit.parentGrid?.removeUnit(unit);
        }
        unit.parentGrid = this;
        const position = positionOverride ? positionOverride : unit.position

        if (positionOverride) {
            unit.position = { ...positionOverride }
        }

        for (let y = 0; y < shape.matrix.length; y++) {
            for (let x = 0; x < shape.matrix[y].length; x++) {
                if (shape.matrix[y][x]) {
                    // Add a building element at the current position
                    // Additional logic for adding building elements
                    this.grid[position.y + y][position.x + x].unit = unit;
                }
            }
        }

        this.units.push(unit);

        this.updateTiles()
    }

    // Remove a building from the city
    removeUnit(unit: Unit) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const tile = this.grid[row][col];
                if (tile.unit === unit) {
                    tile.unit = null; // Remove the building reference from the tile
                }
            }
        }

        if (this.units.includes(unit)) {

            this.units.splice(this.units.indexOf(unit), 1);
        }

        this.updateTiles()

    }

    // Move a building to a new position
    moveUnit(building: Unit, newPosition: UnitPosition) {
        this.grid[building.position.y][building.position.x].unit = null;
        this.grid[newPosition.y][newPosition.x].unit = building;
        building.position = newPosition;
    }

    swapUnits(building1: Unit, building2: Unit) {
        const tempPosition = building1.position;
        this.moveUnit(building1, building2.position);
        this.moveUnit(building2, tempPosition);
    }

    /**
     * find firs slot the unit would fit
     * @param unit 
     * @returns 
     */
    findPositionForUnit(unit: Unit): { x: number, y: number } | null {
        const unitHeight = unit.shape.matrix.length;
        const unitWidth = unit.shape.matrix[0].length;

        // Iterate over each position on the grid
        for (let row = 0; row <= this.grid.length - unitHeight; row++) {
            for (let col = 0; col <= this.grid[0].length - unitWidth; col++) {
                // Check if the building fits at this position
                let canPlaceUnit = true;
                for (let i = 0; i < unitHeight; i++) {
                    for (let j = 0; j < unitWidth; j++) {
                        if (unit.shape.matrix[i][j] && this.grid[row + i][col + j].unit !== null) {
                            // There's already a building at this position
                            canPlaceUnit = false;
                            break;
                        }
                    }
                    if (!canPlaceUnit) {
                        break;
                    }
                }
                if (canPlaceUnit) {
                    // Found a position where the building can fit
                    return { x: col, y: row };
                }
            }
        }
        return null;
    }

    /**
     * Simulates all rotations closer to the first position it founds and return the most optimized to avoid gaps
     * @param unit 
     * @returns 
     */
    findOptimalPositionForUnit(unit: Unit): { x: number, y: number, rotation: RotationAngle } | null {

        const bestPosition = this.findPositionForUnit(unit) || { x: -1, y: -1 };

        if (bestPosition.x < 0 || bestPosition.y < 0) {
            return null;
        }
        const optimal = { x: bestPosition?.x, y: bestPosition?.y, rotation: RotationAngle.Angle0 }
        const unitClone = unit.clone();
        for (let index = 0; index <= RotationAngle.Angle270; index++) {
            unitClone.rotateTo(index);
            for (let row = -5; row < 5; row++) {
                for (let col = -5; col < 5; col++) {
                    const testPosition = { x: bestPosition?.x - row, y: bestPosition?.y - col }
                    if (this.isWithinBounds(testPosition.x, testPosition.y)) {
                        if (this.canPlaceUnit(unitClone, testPosition)) {
                            if (optimal.x > testPosition.x || optimal.y > testPosition.y) {
                                optimal.x = testPosition.x
                                optimal.y = testPosition.y
                                optimal.rotation = index;
                            }
                        }
                    }
                }
            }
        }

        return optimal

    }
    updateCurrencyGenerationRate() {
        for (const building of this.units) {
            let synergyFactor = 1; // Default synergy factor

            // Calculate synergy factor based on neighboring buildings
            for (const neighbor of this.getNeighbors(building)) {
                synergyFactor *= this.synergyCalculator.calculateSynergy(building.data.category_id, neighbor.data.category);
            }

            // Update currency generation rate based on synergy factor
            building.data.currencyGenerationRate *= synergyFactor;
        }
    }

    // Serialize city data
    serialize(): string {
        return JSON.stringify({
            buildings: this.units.map(building => ({
                data: building.data,
                position: building.position,
                shape: building.shape,
            }))
        });
    }
    // Deserialize city data
    deserialize(data: string) {
        const parsedData = JSON.parse(data);
        this.units = parsedData.buildings.map((unitData: any) => new Unit(unitData.data, unitData.position, unitData.shape));
    }
}