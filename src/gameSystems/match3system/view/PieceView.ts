import * as PIXI from "pixi.js";

import gsap from "gsap";
import GameViewContainer from "loggie/core/view/GameViewContainer";
import Loggie from "loggie/core/Loggie";
import Pool from "loggie/core/utils/Pool";

export default class PieceView extends PIXI.Container {
    private colors = [0x223355, 0xff0000, 0x33FF00, 0xFF55ff, 0x990066, 0]
    private tileSize: number = 100
    public uid: integer = -1;
    public offset: number = 0;
    public targetPosition: PIXI.Point = new PIXI.Point();
    private pieceSprite:PIXI.Sprite = new PIXI.Sprite();

    build(...data: any[]): void {
        this.pieceSprite.texture = PIXI.Texture.from('d')
        this.pieceSprite.rotation = (Math.PI / 4)
        this.pieceSprite.scale.set(1, 1)
        this.pieceSprite.anchor.set(0.5)
        this.pieceSprite.x = 50
        this.pieceSprite.y = 50
        this.addChild(this.pieceSprite)
    }
    setType(type: number, uid: integer) {
        this.uid = uid;
        this.pieceSprite.tint = this.colors[type]

    }
    setGridPosition(col: integer, row: integer) {
        this.targetPosition.x = col * (this.tileSize + 2) + this.tileSize / 2
        this.targetPosition.y = row * (this.tileSize + 2) + this.tileSize / 2

        this.x = this.targetPosition.x
        this.y = this.targetPosition.y
    }
    pop() {
        this.pieceSprite.scale.set(0.5, 0.5)
        gsap.killTweensOf(this.pieceSprite.scale)
        gsap.from(this.pieceSprite.scale, {
            duration: 0.25,
            x: 1,
            y: 1,
            ease: 'back.out'
        }).timeScale(Loggie.TimeScale)
    }
    popAndDestroy(delay: number = 0, time: number = 0.3) {
        gsap.killTweensOf(this.pieceSprite.scale)
        gsap.to(this.pieceSprite.scale, {
            x: 1.5,
            y: 1.5,
            delay: delay,
            ease:'cubic.Out',
            duration: time,
            onComplete: () => {
                Pool.instance.returnElement(this)
            }
        }).timeScale(Loggie.TimeScale)

    }
    

}