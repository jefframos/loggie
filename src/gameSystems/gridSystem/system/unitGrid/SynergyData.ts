import { UnitCategory } from "./UnitCategory";

export type SynergyData = {
    category_id: UnitCategory;
    synergy: { [category in UnitCategory]: number };
}