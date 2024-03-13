import Unit from "./Unit";
import { UnitCategory } from "./UnitCategory";
import { UnitPosition } from "./UnitPosition";

export default class GridTile {
    constructor(public position: UnitPosition, public unit: Unit | null) {}
}