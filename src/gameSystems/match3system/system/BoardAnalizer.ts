import GamePiece from "./GamePiece";
import { MatchData } from "./MatchData";
import { SwapData } from "./SwapData";

export default class BoardAnalizer {
    // Find the length of a horizontal match starting at the given position
    static findHorizontalMatchLength(row: number, col: number, board: GamePiece[][]): number {
        const pieceType = board[row][col].type;
        let length = 1;
        let nextCol = col + 1;
        while (nextCol < board[0].length && board[row][nextCol].type === pieceType) {
            length++;
            nextCol++;
        }
        return length;
    }

    // Find the length of a vertical match starting at the given position
    static findVerticalMatchLength(row: number, col: number, board: GamePiece[][]): number {
        const pieceType = board[row][col].type;
        let length = 1;
        let nextRow = row + 1;
        while (nextRow < board.length && board[nextRow][col].type === pieceType) {
            length++;
            nextRow++;
        }
        return length;
    }
    // Check for matches on the game board
    static findMatches(board: GamePiece[][]): MatchData[] {
        const matches: MatchData[] = [];

        // Check horizontally
        for (let i = 0; i < board.length; i++) {
            let j = 0;
            while (j < board[0].length) {
                const matchLength = BoardAnalizer.findHorizontalMatchLength(i, j, board);
                if (matchLength >= 3) {
                    const matchPieces = board[i].slice(j, j + matchLength);
                    if (matchPieces.find(a => { return a.dirty })) {
                        matches.push({ matchLength, pieces: matchPieces });
                        // matchPieces.forEach(piece => {
                        //     piece.dirty = true;
                        // });
                    }
                    j += matchLength;
                } else {
                    j++;
                }
            }
        }

        // Check vertically
        for (let j = 0; j < board[0].length; j++) {
            let i = 0;
            while (i < board.length) {
                const matchLength = BoardAnalizer.findVerticalMatchLength(i, j, board);
                if (matchLength >= 3) {
                    const matchPieces = [];
                    for (let k = 0; k < matchLength; k++) {
                        matchPieces.push(board[i + k][j]);
                    }
                    if (matchPieces.find(a => { return a.dirty })) {
                        // matchPieces.forEach(piece => {
                        //     piece.dirty = true;
                        // });
                        matches.push({ matchLength, pieces: matchPieces });
                    }
                    i += matchLength;
                } else {
                    i++;
                }
            }
        }

        return matches//this.mergeMatches(matches);
    }

    static findMatchSwap(board: GamePiece[][]): SwapData[] {
        const swaps: SwapData[] = [];
        // Iterate over each position on the board
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                // Check if swapping with the piece to the right creates a match
                if (col < board[row].length - 1) {
                    // Swap with the piece to the right

                    BoardAnalizer.swapPieces(board, row, col, row, col + 1);
                    // Check if the swap creates a match
                    if (BoardAnalizer.findMatches(board).length) {
                        // Swap creates a match
                        swaps.push({ row1: row, col1: col, row2: row, col2: col + 1 });
                    }
                    // Undo the swap
                    BoardAnalizer.swapPieces(board, row, col, row, col + 1, false);
                }

                // Check if swapping with the piece below creates a match
                if (row < board.length - 1) {
                    // Swap with the piece below
                    BoardAnalizer.swapPieces(board, row, col, row + 1, col);
                    // Check if the swap creates a match
                    if (BoardAnalizer.findMatches(board).length) {
                        // Swap creates a match
                        swaps.push({ row1: row, col1: col, row2: row + 1, col2: col });
                    }
                    // Undo the swap
                    BoardAnalizer.swapPieces(board, row, col, row + 1, col, false);
                }
            }
        }

        // No match swap found
        return swaps;
    }
    static swapPieces(board: GamePiece[][], row1: number, col1: number, row2: number, col2: number, dirtyState:boolean = true): void {
        const type1 = board[row1][col1].type
        const type2 = board[row2][col2].type

        board[row1][col1].type = type2
        board[row2][col2].type = type1;

        board[row1][col1].dirty = dirtyState;
        board[row2][col2].dirty = dirtyState;
    }

    static mergeArraysWithCommonPieces(matchData: MatchData[]): MatchData[] {
        const mergedMatchData: MatchData[] = [];
        let merged = false;

        // Iterate through each match data
        for (const data of matchData) {
            // Check if the current match data has any common pieces with merged match data
            for (const mergedData of mergedMatchData) {
                if (data.pieces.some(piece => mergedData.pieces.some(mergedPiece => mergedPiece.uid === piece.uid))) {
                    // Merge the current match data with the merged match data
                    mergedData.pieces.push(...data.pieces.filter(piece => !mergedData.pieces.some(mergedPiece => mergedPiece.uid === piece.uid)));
                    merged = true;
                    break; // Break out of the inner loop once merged
                }
            }

            // If no merge occurred, add the current match data as a new merged match data
            if (!merged) {
                mergedMatchData.push(data);
            }

            merged = false; // Reset merged flag for the next iteration
        }

        mergedMatchData.forEach(element => {
            element.matchLength = element.pieces.length;
        });
        return mergedMatchData;
    }
}