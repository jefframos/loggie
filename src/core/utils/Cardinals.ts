export enum CardinalDirection {
    North,
    NorthEast,
    East,
    SouthEast,
    South,
    SouthWest,
    West,
    NorthWest
}
export class CardinalAnimationStructure {
    name!: string;
    flipped!: boolean;
    fps:integer = 14;
    loop:boolean = true;
}
export class CardinalAnimationMap {
    public animationMap: Map<CardinalDirection, CardinalAnimationStructure> = new Map();
}
export class CardinalLookup {
    static cardinalsId = [
        'north',
        'north_east',
        'south',
        'south_east',
        'east'
    ]
    static cardinalMap: Map<CardinalDirection, string> = new Map([
        [CardinalDirection.North, 'north'],
        [CardinalDirection.NorthEast, 'north_east'],
        [CardinalDirection.East, 'east'],
        [CardinalDirection.South, 'south'],
        [CardinalDirection.SouthEast, 'south_east'],
        [CardinalDirection.SouthWest, 'south_west'],
        [CardinalDirection.West, 'west'],
        [CardinalDirection.NorthWest, 'north_west'],
    ])
    static getOpposite(direction: CardinalDirection): CardinalDirection {
        switch (direction) {
            case CardinalDirection.North:
                return CardinalDirection.South
            case CardinalDirection.South:
                return CardinalDirection.North
            case CardinalDirection.East:
                return CardinalDirection.West
            case CardinalDirection.SouthEast:
                return CardinalDirection.NorthWest
            case CardinalDirection.West:
                return CardinalDirection.East
            case CardinalDirection.SouthWest:
                return CardinalDirection.NorthEast
            case CardinalDirection.NorthEast:
                return CardinalDirection.SouthWest
            case CardinalDirection.NorthWest:
                return CardinalDirection.SouthEast
            default:
                return CardinalDirection.South
                break;
        }
    }
    static getFlipped(direction: CardinalDirection): CardinalDirection {
        switch (direction) {
            case CardinalDirection.North:
                return CardinalDirection.South
            case CardinalDirection.South:
                return CardinalDirection.North
            case CardinalDirection.East:
                return CardinalDirection.West
            case CardinalDirection.SouthEast:
                return CardinalDirection.SouthWest
            case CardinalDirection.West:
                return CardinalDirection.East
            case CardinalDirection.SouthWest:
                return CardinalDirection.SouthEast
            case CardinalDirection.NorthEast:
                return CardinalDirection.NorthWest
            case CardinalDirection.NorthWest:
                return CardinalDirection.NorthEast
            default:
                return CardinalDirection.South
                break;
        }
    }
    static cardinalToAngle(direction: CardinalDirection): number {
        switch (direction) {
            case CardinalDirection.North:
                return 0;
            case CardinalDirection.NorthEast:
                return 45;
            case CardinalDirection.East:
                return 90;
            case CardinalDirection.SouthEast:
                return 135;
            case CardinalDirection.South:
                return 180;
            case CardinalDirection.SouthWest:
                return 225;
            case CardinalDirection.West:
                return 270;
            case CardinalDirection.NorthWest:
                return 315;
            default:
                throw new Error("Invalid cardinal direction");
        }
    }
    static flipIf(currentValue: CardinalDirection, cardinals: Array<CardinalDirection>): { cardinalDirection: CardinalDirection, flipped: boolean } {
        const result = { cardinalDirection: currentValue, flipped: false };
        if (cardinals.includes(currentValue)) {
            result.cardinalDirection = this.getFlipped(currentValue);
            result.flipped = true;
        }
        return result;
    }
    static getCardinalDirection(velocityX: number, velocityY: number, lastDirection?: CardinalDirection): CardinalDirection {
        if (velocityX === 0 && velocityY === 0 && lastDirection !== undefined) {
            // If velocity is zero, keep the last direction
            return lastDirection;
        }

        // Calculate angle from velocity
        let angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 90;

        // Normalize angle to be positive
        if (angle < 0) {
            angle += 360;
        }

        // Define angle ranges for each cardinal direction
        const angleRanges = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

        // Determine the direction based on angle
        for (let i = 0; i < angleRanges.length; i++) {
            if (angle < angleRanges[i]) {
                return i === 0 ? CardinalDirection.North : i;
            }
        }

        // If angle is greater than 337.5, return North
        return CardinalDirection.North;
    }
}