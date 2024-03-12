import * as dat from 'dat.gui';
export default class GuiDebugger {

    static _instance: GuiDebugger;
    static get instance() {
        if (!GuiDebugger._instance) {
            GuiDebugger._instance = new GuiDebugger();
        }
        return GuiDebugger._instance;
    }
    private gui: dat.GUI;
    constructor() {

        this.gui = new dat.GUI();
    }
    public listenFolder(folderName: string, parentObject: any, forceOpen: boolean = true) {

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