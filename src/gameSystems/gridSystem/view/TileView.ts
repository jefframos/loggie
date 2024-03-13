import Eugine from "eugine/core/Eugine";
import GameObject from "eugine/core/gameObject/GameObject";
import UiText from "eugine/core/ui/UiText";
import WorldEntityView from "eugine/entities/WorldEntityView";
import { UnitViewData } from "../system/UnitViewData";

export default class TileView extends WorldEntityView {
    private emoji!: Phaser.GameObjects.Text;
    private synergy!: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }
    build(data: UnitViewData, synergyValue:number = 1): void {
        super.build('square', 'grid');

        if (data) {
            this.view.setTint(data.color)
            this.emoji = this.scene.add.text(0, 0, data.emoji, { fontSize: 38 })
            this.emoji.setOrigin(0.5,0.5)
            this.synergy = this.scene.add.text(0, 0, synergyValue.toFixed(1).toString(), { fontSize: 20, stroke:"#000000", strokeThickness:5 })
            if(synergyValue > 1){
                this.synergy.setColor('#00ff00')
            }else if(synergyValue < 1){
                this.synergy.setColor('#ff0000')
            }
            this.synergy.setOrigin(0.5,0.5)
        } else {
            this.view.setTint(0x999999)
        }

    }
    update(delta: number, time: number): void {
        super.update(delta, time)
        if (this.emoji) {
            this.emoji.setDepth(80000)
            this.synergy.setDepth(80001)
            const global = this.view.getWorldTransformMatrix()
            this.emoji.x = global.tx
            this.emoji.y = global.ty
            this.synergy.x = global.tx
            this.synergy.y = global.ty
        }
    }
    destroy(): void {
        super.destroy();
        if (this.emoji) {
            this.emoji.destroy();
        }
        if (this.synergy) {
            this.synergy.destroy();
        }
    }
}