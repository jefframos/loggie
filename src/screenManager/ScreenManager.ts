import * as PIXI from 'pixi.js';
import Screen from './Screen';

export default class ScreenManager extends PIXI.Container {
	protected prevScreen:string = '';
	protected currentScreen!: Screen;
	protected screenList: Map<string, Screen> = new Map();
	protected screensContainer = new PIXI.Container();
	constructor() {
		super();
		this.screensContainer = new PIXI.Container();
		this.addChild(this.screensContainer);
	}
	addScreen(screen:Screen) {
		this.screenList.set(screen.label, screen);
		this.currentScreen = screen;

		if (this.currentScreen.onEndTransitionIn) {
			this.currentScreen.onEndTransitionIn.add(this.endTransitionInTo.bind(this))
		}
		if (this.currentScreen.onEndTransitionOut) {
			this.currentScreen.onEndTransitionOut.add(this.endTransitionOutTo.bind(this))
		}
		if (this.currentScreen.onStartTransitionIn) {
			this.currentScreen.onStartTransitionIn.add(this.startTransitionInTo.bind(this))
		}
		if (this.currentScreen.onStartTransitionOut) {
			this.currentScreen.onStartTransitionOut.add(this.startTransitionOutTo.bind(this))
		}
		screen.screenManager = this;
	
	}
	backScreen() {
		this.change(this.prevScreen);
	}
	change(screenLabel:string, param:any = {}) {
		console.log('--', param)
		if(this.screenList.has(screenLabel)){
			const next = this.screenList.get(screenLabel);
			if (this.currentScreen && next) {
				this.currentScreen.transitionOut(next, param);
			}
			this.startChanging();
		}
	}

	aspectChange(isPortrait:boolean) {

		for (const [key, value] of this.screenList) {
			value.aspectChange(isPortrait)
		}		
	}
	startTransitionInTo(screen:Screen) { }
	startTransitionOutTo(screen:Screen, nextScreen:Screen) { }
	endTransitionInTo(screen:Screen) { }
	endTransitionOutTo(screen:Screen, nextScreen:Screen) { }
	startChanging() { }
	//change between screens
	forceChange(screenLabel:string, param:any = {}) {
		if (this.currentScreen && this.currentScreen.parent) {
			this.currentScreen.parent.removeChild(this.currentScreen);
			this.prevScreen = this.currentScreen.label;
		}

		console.log('ADD',this.screenList)	
		if(this.screenList.has(screenLabel)){
			const next = this.screenList.get(screenLabel);
			if(next){
				this.currentScreen = next;
			}
			
			this.currentScreen.transitionIn(param);	
			this.screensContainer.addChild(this.currentScreen);
			if (!this.resolution) {
				this.resolution = { width: innerWidth, height: innerHeight };
			}
			this.startChanging();
			this.resize(this.resolution);
		}

	
	}
	//update manager
	update(delta) {
		this.resolution = { width: innerWidth, height: innerHeight };
		//this.resize(this.resolution);
		if (this.screenList != null) {
			this.currentScreen.update(delta);
		}
	}
	resize(newSize, innerResolution) {

		for (let i = 0; i < this.screenList.length; i++) {
			if (this.screenList[i].resize) {
				this.screenList[i].resize(newSize, innerResolution)
			}
		}
	}
}
