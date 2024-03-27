import * as dat from 'dat.gui';
export default class GuiDebugger {

    static MatterDebug:boolean = false;
    static _instance: GuiDebugger;
    static get instance() {
        if (!GuiDebugger._instance) {
            GuiDebugger._instance = new GuiDebugger();
        }
        return GuiDebugger._instance;
    }
    private _disabled: boolean = false;
    public set disabled(value: boolean) {
        this._disabled = value;        
        if (value) {
            if (this.gui) {
                this.gui.destroy();
            }
        }
    }
    private gui!: dat.GUI;
    constructor() {

        if (this._disabled) {
            return
        }
        this.gui = new dat.GUI();
    }

    public listenFolder(folderName: string, parentObject: any, forceOpen: boolean = true) {

        if (this._disabled) {
            return
        }
        if (!this.gui) {
            this.gui = new dat.GUI();
        }
        const folder = this.gui.addFolder(folderName);

        for (const key in parentObject) {
            if (Object.prototype.hasOwnProperty.call(parentObject, key)) {
                folder.add(parentObject, key).listen()
            }
        }
        if (forceOpen) {
            folder.open();
        }
    }


}