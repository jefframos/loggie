
import Eugine from "../Eugine";
import GameObject from "../gameObject/GameObject";
import AnalogInput from "./AnalogInput";
import WasdInput from "./WasdInput";

export default class MovementInputService extends GameObject {
    private inputProvider?: InputDirections;
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);        
    }
    build(){
        if (this.isMobile) {
            const analogInput = this.addFromPool(AnalogInput);
            analogInput.build('input/stick', 'ui', 'input/stick');
            this.inputProvider = analogInput;
        } else {
            const wasdInput = this.addFromPool(WasdInput);
            wasdInput.build();
            this.inputProvider = wasdInput;
        }
    }
    get isMobile() {
        return this.scene.sys.game.device.os.android || this.scene.sys.game.device.os.iOS;
    }
    get direction() {
        return this.inputProvider.getDirections();
    }
    get pointerDown() {
        return this.inputProvider.getPressed();
    }
    get inputNormal() {
        return this.inputProvider.getNormal();
    }
}