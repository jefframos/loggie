import * as PIXI from "pixi.js";
import GameBoard from "../system/GameBoard";
import PieceView from "./PieceView";
import GamePiece from '../system/GamePiece';
import gsap from "gsap";
import Pool from "loggie/core/utils/Pool";
import GameObject from "loggie/core/gameObject/GameObject";
import GameViewContainer from "loggie/core/view/GameViewContainer";
import { RenderLayers } from "loggie/core/render/RenderLayers";
import { Signal } from "signals";
import { EasePack } from "gsap/all";
import Loggie from "loggie/core/Loggie";

export default class BoardView extends GameObject {
    private mainContainer!:  GameViewContainer;
    private pieceContainer!:  GameViewContainer;
    private pieces: PieceView[][] = [];
    private tileSize: number = 100;

    public onBoardClick:Signal = new Signal();
 
    build(...data: any[]): void {

        this.mainContainer = this.addComponent(GameViewContainer, true)
        this.mainContainer.layer = RenderLayers.UILayerOverlay
        this.pieceContainer = this.addComponent(GameViewContainer, true)
        this.pieceContainer.layer = RenderLayers.UILayerOverlay

        this.mainContainer.view.interactive = true;        
    }
    drawBoard(gameBoard: GameBoard) {
        for (let i = 0; i < gameBoard.numRows; i++) {
            for (let j = 0; j < gameBoard.numCols; j++) {
                const x = j * (this.tileSize + 2) + this.tileSize / 2;
                const y = i * (this.tileSize + 2) + this.tileSize / 2;
                const tile = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,this.tileSize,this.tileSize)
                tile.x = x
                tile.y = y
                tile.interactive = true;
                tile.onclick = ()=>{
                    this.onBoardClick.dispatch(i,j)
                }
                this.mainContainer.addChild(tile)
            }
        }
    }
    getPiece(): PieceView {
        const piece = Pool.instance.getElement(PieceView)
        piece.build();
        return piece;
    }
    shiftDown(beforeShift: GamePiece[][], afterShift: GamePiece[][]):number {
        const afterFlat = afterShift.flat().filter(piece => piece != undefined)
        const beforeShiftFlat = beforeShift.flat().filter(piece => piece != undefined)

        const newOnes = beforeShiftFlat.filter(item => !afterFlat.some(otherItem => otherItem.uid === item.uid))
            .concat(afterFlat.filter(item => !beforeShiftFlat.some(otherItem => otherItem.uid === item.uid)));

        type Mover = {
            fromRow: integer,
            toRow: integer,
            col: integer
        }
        const movers: Mover[] = []
        afterFlat.forEach(element => {
            const piece = beforeShiftFlat.filter(piece => piece.uid == element.uid)
            if (piece.length) {
                const beforePiece = piece[0];
                if (beforePiece.row != element.row) {
                    movers.push({
                        fromRow: beforePiece.row,
                        toRow: element.row,
                        col: element.col
                    })
                }
            }
        });

        newOnes.forEach(element => {
            movers.push({
                fromRow: element.row - afterShift.length - 1,
                toRow: element.row,
                col: element.col
            })
        });


        movers.forEach(element => {
            const piece = this.pieces[element.toRow][element.col]
            gsap.killTweensOf(piece)
            gsap.from(piece, {
                duration: 0.35,
                y: piece.y + (element.fromRow - element.toRow) * this.tileSize,
                ease:'back.Out',
            }).timeScale(Loggie.TimeScale)
            //piece.update(0.1, 0)
        });

        return 0.35
    }
    addPieceAt(i: number, j: number, pieceData: GamePiece) {
        if (this.pieces[i][j]) {
            this.pieces[i][j].destroy();
        }

        const piece = this.getPiece();
        piece.setType(pieceData.type, pieceData.uid)
        piece.setGridPosition(j, i)
        this.pieces[i][j] = piece;
        this.pieceContainer.addChild(piece)
    }
    startPieces(gameBoard: GameBoard) {
        //this.removeAllPieces();
        for (let i = 0; i < gameBoard.numRows; i++) {
            this.pieces[i] = [];
            for (let j = 0; j < gameBoard.numCols; j++) {
                this.addPieceAt(i, j, gameBoard.board[i][j])

            }
        }
    }
    updatePieces(gameBoard: GameBoard) {
        //this.removeAllPieces();
        for (let i = 0; i < gameBoard.numRows; i++) {
            for (let j = 0; j < gameBoard.numCols; j++) {
                if (this.pieces[i][j]) {
                    const uid = this.pieces[i][j].uid
                    if (uid < 0 || uid != gameBoard.board[i][j].uid) {
                        this.pieces[i][j].destroy();
                        this.addPieceAt(i, j, gameBoard.board[i][j])
                    }
                } else {
                    this.addPieceAt(i, j, gameBoard.board[i][j])
                }
            }
        }
    }
    public removeAllPieces() {
        for (let i = 0; i < this.pieces.length; i++) {
            for (let j = 0; j < this.pieces[0].length; j++) {
                this.pieces[i][j]?.destroy();
            }
        }
        this.pieces = []
    }
    public comboPieces(pieces: GamePiece[], matchOrder: number): number {

        let popTimer = 0.8
        let delay = (matchOrder * 0.15)
        for (const piece of pieces) {
            const { row, col } = piece;
            const toDestroy = this.pieces[row][col];
            if (toDestroy) {
                toDestroy.popAndDestroy(delay, popTimer);
            }
            this.pieces[row][col] = undefined
        }
        return popTimer + 0.2 + delay
    }
    swapPieces(row1: number, col1: number, row2: number, col2: number) {
        const view1 = this.pieces[row1][col1]
        const view2 = this.pieces[row2][col2]
        gsap.killTweensOf(view1)
        gsap.killTweensOf(view2)

        const view1X = view1.x;
        const view1Y = view1.y;
        const view2X = view2.x;
        const view2Y = view2.y;

        const copy = this.pieces[row1][col1]
        this.pieces[row1][col1] = this.pieces[row2][col2]
        this.pieces[row2][col2] = copy

        gsap.to(view1, {
            duration: 0.15,
            x: view2X,
            y: view2Y,
            ease:'back.Out',
            onComplete: () => {
                view1.x = view2X;
                view1.y = view2Y;
            }
        }).timeScale(Loggie.TimeScale)

        gsap.to(view2, {
            duration: 0.15,
            x: view1X,
            y: view1Y,
            ease:'back.Out',
            onComplete: () => {
                view2.x = view1X;
                view2.y = view1Y;
            }
        }).timeScale(Loggie.TimeScale)

    }
}