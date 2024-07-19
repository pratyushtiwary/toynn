import NArray from '../../narray';

describe('NArray Flatten Tests', () => {
    test('Two Dimension', () => {
        const myArray = [
            [1, 2],
            [3, 4],
            [5, 6],
        ];
        const output = [1, 2, 3, 4, 5, 6];

        const myNArray = new NArray(myArray);

        expect(myNArray.flatten()).toStrictEqual(output);
    });

    test('N Dimension', () => {
        const myArray = [
            [
                [
                    [1, 2],
                    [3, 4],
                ],
                [
                    [5, 6],
                    [7, 8],
                ],
            ],
            [
                [
                    [9, 10],
                    [12, 11],
                ],
                [
                    [13, 14],
                    [15, 16],
                ],
            ],
        ];
        const output = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11, 13, 14, 15, 16];

        const myNArray = new NArray(myArray);

        expect(myNArray.flatten()).toStrictEqual(output);
    });
});
