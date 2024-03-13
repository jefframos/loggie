import { UnitPosition } from "./UnitPosition";


export default class GridUtils {

    // Function to get 4-neighbor tiles
    static get4NeighborTiles(position: UnitPosition, gridSizeX: number, gridSizeY: number): UnitPosition[] {
        const neighbors: UnitPosition[] = [];
        const { x, y } = position;

        if (x > 0) {
            neighbors.push({ x: x - 1, y });
        }
        if (x < gridSizeX - 1) {
            neighbors.push({ x: x + 1, y });
        }
        if (y > 0) {
            neighbors.push({ x, y: y - 1 });
        }
        if (y < gridSizeY - 1) {
            neighbors.push({ x, y: y + 1 });
        }

        return neighbors;
    }

    // Function to get 8-neighbor tiles
    static get8NeighborTiles(position: UnitPosition, gridSizeX: number, gridSizeY: number): UnitPosition[] {
        const neighbors: UnitPosition[] = [];
        const { x, y } = position;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (newX >= 0 && newX < gridSizeX && newY >= 0 && newY < gridSizeY) {
                        neighbors.push({ x: newX, y: newY });
                    }
                }
            }
        }

        return neighbors;
    }
}