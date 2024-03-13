export default interface GamePiece {
    uid: integer;
    row: number;
    col: number;
    type: number;
    dirty: boolean;
    offset: number;
}
