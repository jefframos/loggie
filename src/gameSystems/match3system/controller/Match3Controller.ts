import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import GameBoard from '../system/GameBoard';
import BoardView from '../view/BoardView';
import DataUtils from 'loggie/utils/DataUtils';
export default class  Match3Controller extends GameObject {
    private gameBoard!: GameBoard;
    private boardView!: BoardView;
    private tileBuffer:PIXI.Point | null = null;
    private canMove:boolean = true;
    private autoplay:boolean = false;
    constructor(){
        super()
    }
    build(gameBoard:GameBoard, boardView: BoardView, autoplay:boolean = false){
        super.build();
        this.autoplay = autoplay;
        this.gameBoard = gameBoard;
        this.boardView = boardView;
        this.boardView.drawBoard(this.gameBoard)
        this.boardView.startPieces(this.gameBoard);
        this.boardView.onBoardClick.add((i,j)=>{

            if (!this.tileBuffer) {
                this.tileBuffer = new PIXI.Point(j, i)
            } else {

                this.doSwap(this.tileBuffer.y, this.tileBuffer.x, i, j)

                this.tileBuffer = null;
                this.findMatchesAndUpdateView();
            }
        })
    }
    //do this after swap a piece
    public async findMatchesAndUpdateView(): Promise<void> {
        let continueChecking = true;
        this.canMove = false;

        let firstCheck: boolean = true;
        let shiftDownTime = 0;
        //console.log('on the matches sometimes there is different types what gves wrong combination')
        while (continueChecking) {
            const matches = this.gameBoard.findMatches()
            // Wait for a short delay (e.g., for animations to complete)        
            if (matches.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 300 / Loggie.TimeScale));
                // Remove pieces from the board based on matches
                let matchId = 0
                let comboTime = 0
                matches.forEach(match => {
                    this.gameBoard.removePieces(match.pieces)
                    comboTime = this.boardView.comboPieces(match.pieces, matchId)
                    matchId++
                });

                //wait for the combo animations finish
                await new Promise(resolve => setTimeout(resolve, (300 + (comboTime * 1000)) / Loggie.TimeScale));

                //stamp board
                const beforeShift = this.gameBoard.boardStamp;
                //shift down
                this.gameBoard.shiftDown();

                //stamp after shift
                const afterShift = this.gameBoard.boardStamp;
               
                //update pieces on the data
                this.boardView.updatePieces(this.gameBoard);

                //check the difference between the boards and animate the pieces falling
                shiftDownTime = this.boardView.shiftDown(beforeShift, afterShift);

                //mark that is not first check anymore
                firstCheck = false;
            } else {

                //if first check has no match, revert the swap
                if (firstCheck) {
                    this.revertSwap();
                }

                //stop the checking routine
                continueChecking = false;
                this.canMove = true;
            }
        }

        //clean all dirty pieces
        this.gameBoard.clearDirty();

        //can move again
        this.canMove = true;


        if (this.autoplay) {
            await new Promise(resolve => setTimeout(resolve, (400 + shiftDownTime * 1000) / Loggie.TimeScale));
            this.getMove()
        }
    }
    doSwap(row1: integer, col1: integer, row2: integer, col2: integer) {
        this.gameBoard.swapPieces(row1, col1, row2, col2);
        this.boardView.swapPieces(row1, col1, row2, col2);
    }
    getMove() {
        const moves = DataUtils.shuffleArray(this.gameBoard.findMatcheSwaps())
        this.doSwap(moves[0].row1, moves[0].col1, moves[0].row2, moves[0].col2)

        this.findMatchesAndUpdateView();

    }
    revertSwap() {
        const revertData = this.gameBoard.revertSwap();
        setTimeout(() => {
            this.boardView.swapPieces(revertData.row2, revertData.col2, revertData.row1, revertData.col1);
        }, 180 / Loggie.TimeScale);

    }

    update(delta:number, unscaledTime:number){
        super.update(delta, unscaledTime);
    }
}