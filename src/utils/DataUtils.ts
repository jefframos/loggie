export default class DataUtils {
    static getKeyByValue<K, V>(map: Map<K, V>, searchValue: V): K | undefined {
        for (const [key, value] of map.entries()) {
            if (value === searchValue) {
                return key;
            }
        }
        return undefined; // Return undefined if the value is not found
    }

    static shuffleArray<T>(array: T[]): T[] {
        // Clone the array to avoid modifying the original array
        const shuffledArray = [...array];

        // Fisher-Yates shuffle algorithm
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        return shuffledArray;
    }
    static matrixBoundCheck(i: number, j: number, matrix: any[][]): boolean {
        return (
            i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length
        );
    }
}