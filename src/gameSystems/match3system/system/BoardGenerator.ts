import GamePiece from "./GamePiece";
import { SwapData } from "./SwapData";

export default class BoardGeneration {
    private static _uniqueId: integer = 0;

    constructor(){
    }
    static  pieceGenerator(row: integer, col: integer, dirty: boolean = false, customType:integer = -1): GamePiece {
        return {
            uid: ++BoardGeneration._uniqueId,
            row: row,
            col: col,
            type: customType >= 0 ? customType : Math.ceil(Math.random() * 4),
            dirty: dirty,
            offset: 0,
        }
    }
    static generateUniquePiece(row: number, col: number, board: GamePiece[][]): GamePiece {
        let piece: GamePiece;
        do {
            // Generate a piece for the current position
            piece = this.pieceGenerator(row, col, false);
    
            // Check if the piece is valid (not part of three consecutive pieces)
        } while (this.isPartOfThreeConsecutive(row, col, piece, board));
    
        return piece;
    }
    
    static isPartOfThreeConsecutive(row: number, col: number, piece: GamePiece, board: GamePiece[][]): boolean {
        const sameTypeAdjacent = (r: number, c: number, dr: number, dc: number) => {
            return board[r]?.[c]?.type === piece.type;
        };
    
        // Check horizontally
        if (sameTypeAdjacent(row, col - 1, 0, -1) && sameTypeAdjacent(row, col - 2, 0, -1)) {
            return true;
        }
    
        // Check vertically
        if (sameTypeAdjacent(row - 1, col, -1, 0) && sameTypeAdjacent(row - 2, col, -1, 0)) {
            return true;
        }
    
        return false;
    }
    
}