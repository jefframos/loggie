import * as PIXI from 'pixi.js';

import signals from 'signals';

export default class Screen extends PIXI.Container {
	constructor(label, targetContainer) {
		super();
		this.targetContainer = targetContainer;
		this.label = label;
		this.entityList = [];
		this.updateable = false;
		this.nextScreen;
		this.screenManager;
		this.built;
		this.onEndTransitionOut = new signals.Signal();
		this.onEndTransitionIn = new signals.Signal();

		this.onStartTransitionOut = new signals.Signal();
		this.onStartTransitionIn = new signals.Signal();
	}
	//add here the entities to easily remove after by parameter "kill"
	addChild(entity) {
		super.addChild(entity);
		this.entityList.push(entity);
	}
	//if the element is inside another, put here to force updates on the screen
	addOnUpdateList(entity) {
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i] == entity) {
				return;
			}
		}
		this.entityList.push(entity);
	}
	//update all childs
	update(delta) {
		if (!this.updateable) {
			return;
		}
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i].update) {
				this.entityList[i].update(delta);
			}
		}
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i].kill) {
				if (this.entityList[i].parent) {
					this.entityList[i].parent.removeChild(this.entityList[i]);
				}
				this.entityList.splice(i, 1);
			}
		}
	}

	destroy() {
		this.built = false;
	}
	build() {
		this.built = true;
	}
	transitionIn(param) {
		this.onStartTransitionIn.dispatch(this);
		this.updateable = true;
		this.visible = true;
		this.endTransitionIn(param);
	}
	endTransitionIn(param) {
		this.onEndTransitionIn.dispatch(this);
		this.visible = true;
		this.build(param)
	}
	transitionOut(nextScreen, param, delay = 0) {
		this.onStartTransitionOut.dispatch(this, nextScreen);
		this.nextScreen = nextScreen;
		this.visible = true;

		this.endTransitionOut(param, delay);

	}
	endTransitionOut(param, delay) {
		this.onEndTransitionOut.dispatch(this, this.nextScreen);
		this.updateable = false;
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
}
