import { UnitData } from "./UnitData";
import UnitGrid from "./UnitGrid";
import { UnitPosition } from "./UnitPosition";
import { UnitShape } from "./UnitShape";
import { RotationAngle } from './RotationAngle';

export default class Unit {
    public synergyGrid: Array<Array<number>> = [];
    private originalShape: UnitShape = { matrix: [[true]] };
    public rotationAngle: RotationAngle = RotationAngle.Angle0;

    get synergySum(): number {
        return this.synergyGrid.reduce((acc, row) => acc + row.reduce((rowSum, val) => rowSum + val, 0), 0);
    }

    clone(): Unit {
        return new Unit(this.parentGrid, {...this.data}, {...this.position}, {...this.shape})
    }
    constructor(public parentGrid: UnitGrid | null, public data: UnitData, public position: UnitPosition, public shape: UnitShape = { matrix: [[true]] }) {
        this.originalShape = { ...shape };
        this.resetSynergy();
    }

    rotateTo(targetRotation: RotationAngle) {
        this.shape.matrix = [...this.originalShape.matrix]

        for (let index = 0; index < targetRotation; index++) {
            this.rotateUnitClockwise();
        }
    }

    rotateUnitClockwise() {
        const rotatedMatrix = [];
        const numRows = this.shape.matrix.length;
        const numCols = this.shape.matrix[0].length;
        for (let x = 0; x < numCols; x++) {
            rotatedMatrix[x] = [];
            for (let y = 0; y < numRows; y++) {
                rotatedMatrix[x][y] = this.shape.matrix[numRows - y - 1][x];
            }
        }
        this.shape.matrix = rotatedMatrix;
        this.resetSynergy();

        this.rotationAngle ++;
        this.rotationAngle %= 4;
    }

    resetSynergy() {
        this.synergyGrid = [];
        let line: Array<number> = [];
        const numRows = this.shape.matrix.length;
        const numCols = this.shape.matrix[0].length;
        for (let x = 0; x < numRows; x++) {
            line = [];
            for (let y = 0; y < numCols; y++) {
                line.push(1)
            }
            this.synergyGrid.push(line)
        }
    }
    applySynergy(x: number, y: number, value: number) {
        this.synergyGrid[y][x] += value;
    }
    getRelativeTileSynergy(x: number, y: number): number {
        const relativePosition = { x: x - this.position.x, y: y - this.position.y }
        return this.synergyGrid[relativePosition.y][relativePosition.x]
    }

}