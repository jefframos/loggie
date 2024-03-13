import { UnitCategory } from "./UnitCategory";
import { SynergyData } from "./SynergyData";

export default class SynergyCalculator {
    private synergyData: SynergyData[];

    constructor(synergyData: SynergyData[]) {
        this.synergyData = synergyData;
    }

    // Calculate synergy factor between two Unit categories
    calculateSynergy(category1: UnitCategory, category2: UnitCategory): number {
        if(!this.synergyData){
            return 1;
        }
        const synergyRecord = this.synergyData.find(record => record.category_id === category1);
        if (synergyRecord) {
            return synergyRecord.synergy[category2] || 1; // Default synergy factor of 1 if no synergy found
        }
        return 1; // Default synergy factor of 1 if no synergy data found for the category
    }
}