import * as PIXI from 'pixi.js';

import signals from 'signals';
import ScreenManager from './ScreenManager';

export default class Screen extends PIXI.Container {
	protected targetContainer:PIXI.Container | undefined;
	protected nextScreen!: Screen;
	protected built: boolean = false;

	public label:string;
	public screenManager!: ScreenManager;

	public onEndTransitionOut = new signals.Signal();
	public onEndTransitionIn = new signals.Signal();
	public onStartTransitionOut = new signals.Signal();
	public onStartTransitionIn = new signals.Signal();

	constructor(label:string, targetContainer:PIXI.Container | undefined = undefined) {
		super();

		this.label = label;
		this.targetContainer = targetContainer;
	}

	//update all childs
	update(delta:number) {		
	}

	destroy() {
		this.built = false;
	}
	build(param:any = {}) {
		this.built = true;
	}
	transitionIn(param:any = {}) {
		this.onStartTransitionIn.dispatch(this);
		this.visible = true;
		this.endTransitionIn(param);
	}
	endTransitionIn(param:any = {}) {
		this.onEndTransitionIn.dispatch(this);
		this.visible = true;
		this.build(param)
	}
	transitionOut(nextScreen:Screen, param:any = {}, delay:number = 0) {
		this.onStartTransitionOut.dispatch(this, nextScreen);
		this.nextScreen = nextScreen;
		this.visible = true;

		this.endTransitionOut(param, delay);

	}
	endTransitionOut(param:any = {}, delay:number = 0) {
		this.onEndTransitionOut.dispatch(this, this.nextScreen);
		if (!delay) {
			console.log("onEndTransitionOut with NO delay", this.visible)
			this.screenManager.forceChange(this.nextScreen.label, param);
			this.destroy();
		} else {
			console.log("onEndTransitionOut with delay", this.visible, param)
			setTimeout(() => {
				this.screenManager.forceChange(this.nextScreen.label, param);
				this.destroy();
			}, delay);
		}
	}
	aspectChange(isPortrait:boolean){
		
	}
}
