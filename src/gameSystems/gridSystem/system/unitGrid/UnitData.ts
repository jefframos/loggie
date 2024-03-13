import { UnitCategory } from "./UnitCategory";
import { RotationAngle } from "./RotationAngle";

export interface UnitData {
    unit_id: string;
    level: number;
    upgradeCost: number;
    currencyGenerationRate: number;
    angle: RotationAngle; // New property for angle
    category_id: UnitCategory; // New property for category
}