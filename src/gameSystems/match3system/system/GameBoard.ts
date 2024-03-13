import BoardAnalizer from "./BoardAnalizer";
import BoardGenerator from "./BoardGenerator";
import GamePiece from "./GamePiece";
import { SwapData } from "./SwapData";


export default class GameBoard {
    public readonly numRows: number;
    public readonly numCols: number;
    private _board: GamePiece[][];
    private currentSwap: SwapData;
    public get board(): GamePiece[][] {
        return this._board;
    }
    constructor(numRows: number, numCols: number) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.currentSwap = {
            row1: -1,
            col1: -1,
            row2: -1,
            col2: -1,
        }
        this._board = this.initializeGameBoard();
    }
    get boardStamp(): GamePiece[][] {
        return this._board.map(row => row.map(obj => obj !== null && obj !== undefined ? { ...obj } : obj));
    }
    compareMatrices(board1: (GamePiece | undefined)[][], board2: (GamePiece | undefined)[][]): (GamePiece | undefined)[][] {
        return board1.map((row, rowIndex) =>
            row.map((obj, colIndex) => {
                const obj2 = board2[rowIndex][colIndex];
                if (!obj || !obj2) {
                    // Include if either object is undefined
                    return obj || obj2;
                }
                // Compare IDs if both objects are defined
                return obj.uid !== obj2.uid ? obj : undefined;
            })
        );;
    }


    // Initialize the game board with random pieces
    private initializeGameBoard(): GamePiece[][] {
        const board: GamePiece[][] = [];
        for (let i = 0; i < this.numRows; i++) {
            board[i] = [];
            for (let j = 0; j < this.numCols; j++) {
                board[i][j] = board[i][j] = BoardGenerator.generateUniquePiece(i, j, board);
            }
        }
        return board;
    }

    // Print the game board to console (for testing)
    public printGameBoard(gameBoard: GamePiece[][]): void {
        for (const row of gameBoard ? gameBoard : this._board) {
            console.log(row.map(piece => (piece ? (piece.type + '' + piece.uid + piece?.dirty?.toString()[0]) : '---')).join('-'));
        }
        console.log('\n')
    }

    public revertSwap(): SwapData {
        this.swapPieces(
            this.currentSwap.row1, this.currentSwap.col1,
            this.currentSwap.row2, this.currentSwap.col2
        )
        return this.currentSwap;
    }
    // Swap two pieces on the game board
    public swapPieces(row1: number, col1: number, row2: number, col2: number): void {
        const temp = { ...this._board[row1][col1] };
        const temp2 = { ...this._board[row2][col2] };
        this._board[row1][col1].type = temp2.type
        this._board[row2][col2].type = temp.type;
        // Mark the swapped pieces as dirty
        this._board[row1][col1].dirty = true;
        this._board[row2][col2].dirty = true;

        this.currentSwap.row1 = row1;
        this.currentSwap.row2 = row2;
        this.currentSwap.col1 = col1;
        this.currentSwap.col2 = col2;
    }

    findMatcheSwaps() {
        const clone = this.boardStamp
        return BoardAnalizer.findMatchSwap(clone)
    }
    findMatches() {
        return BoardAnalizer.mergeArraysWithCommonPieces(BoardAnalizer.findMatches(this._board))
    }
    public removePieces(pieces: GamePiece[]): void {
        for (const piece of pieces) {
            const { row, col } = piece;
            this._board[row][col] = undefined;
        }
    }
    // Shift down the pieces above the removed pieces
    public shiftDown(): GamePiece[] {
        const newColoumns: GamePiece[][] = [];
        const moveDownPieces: GamePiece[] = [];
        for (let col = 0; col < this.numCols; col++) {
            const newColumn: GamePiece[] = [];
            let newRow = this.numRows - 1;
            for (let row = this.numRows - 1; row >= 0; row--) {
                if (this._board[row][col] !== undefined) {
                    this._board[row][col].row = newRow;
                    moveDownPieces.push(this._board[row][col])
                    newColumn.unshift(this._board[row][col]);
                    newRow--;
                }
            }
            // Fill empty spaces at the top with new pieces
            while (newRow >= 0) {
                const newPiece = BoardGenerator.pieceGenerator(newRow, col, true)
                newPiece.offset = newRow;
                newColumn.unshift(newPiece);
                newRow--;
            }
            // Update the game board with the shifted pieces
            for (let row = 0; row < this.numRows; row++) {
                this._board[row][col] = newColumn[row];
            }
            const onlyDirt = newColumn.filter(piece => piece && piece?.dirty)

            newColoumns.push(onlyDirt.filter(piece => piece))
        }
        return newColoumns.flat();
    }

    // Update the game board after removing pieces
    public updateBoardAfterRemoval(pieces: GamePiece[]): void {
        this.removePieces(pieces);
        this.shiftDown();
    }
    public findPossibleSwaps(): SwapData[] {
        return BoardGenerator.findPossibleSwaps(this._board);
    }
    private mergeMatches(matches: { matchLength: number, pieces: GamePiece[] }[]): { matchLength: number, pieces: GamePiece[] }[] {
        const mergedMatches: { matchLength: number, pieces: GamePiece[] }[] = [];

        // Helper function to check if a piece is part of any match in the mergedMatches array
        const isPieceInMergedMatches = (piece: GamePiece): boolean => {
            return mergedMatches.some(match => match.pieces.includes(piece));
        };

        // Iterate through each match in the original list
        for (const match of matches) {
            let merged = false;

            // Check if any piece in the current match is already part of a merged match
            for (const piece of match.pieces) {
                if (isPieceInMergedMatches(piece)) {
                    // If a piece from the current match is already part of a merged match, merge the matches
                    const existingMatchIndex = mergedMatches.findIndex(existingMatch => existingMatch.pieces.includes(piece));
                    mergedMatches[existingMatchIndex].pieces.push(...match.pieces.filter(p => !mergedMatches[existingMatchIndex].pieces.includes(p)));
                    merged = true;
                    break;
                }
            }

            // If the current match was not merged with any existing match, add it to the merged matches list
            if (!merged) {
                mergedMatches.push(match);
            }
        }

        return mergedMatches;
    }

    public clearDirty(): void {
        for (const row of this._board) {
            for (const piece of row) {
                if (!piece) continue;
                piece.dirty = false;
            }
        }
    }

}