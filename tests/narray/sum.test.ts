import NArray from '../../narray';

describe('NArray Sum Tests', () => {
    test('no axis provided', () => {
        const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9];
        const myNArray = new NArray(myArray);

        const sum = myNArray.sum().flatten()[0];

        expect(sum).toBe(myArray.reduce((a, b) => a + b));
    });

    test('1st Axis', () => {
        // output is from numpy
        const myArray = [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 9],
            [8, 10],
        ];
        const myNArray = new NArray(myArray);
        const output = [3, 7, 11, 16, 18];

        const sum = myNArray.sum(1).flatten();

        expect(sum).toStrictEqual(output);
    });

    test('2nd Axis', () => {
        // output is from numpy
        const myArray = [
            [
                [1, 2],
                [8, 9],
            ],
            [
                [10, 5],
                [20, 4],
            ],
            [
                [5, 9],
                [10, 12],
            ],
        ];
        const myNArray = new NArray(myArray);
        const output = [
            [3, 17],
            [15, 24],
            [14, 22],
        ];

        const sum = myNArray.sum(2).real;

        expect(sum).toStrictEqual(output);
    });

    test('3rd Axis', () => {
        // output is from numpy
        const myArray = [
            [
                [
                    [1, 2],
                    [9, 10],
                ],
                [
                    [20, 21],
                    [12, 5],
                ],
            ],
            [
                [
                    [23, 6],
                    [24, 46],
                ],
                [
                    [10, 1],
                    [5, 8],
                ],
            ],
        ];
        const myNArray = new NArray(myArray);
        const output = 203;
        const output1 = [
            [
                [21, 23],
                [21, 15],
            ],

            [
                [33, 7],
                [29, 54],
            ],
        ];
        const output2 = [
            [
                [10, 12],
                [32, 26],
            ],

            [
                [47, 52],
                [15, 9],
            ],
        ];
        const output3 = [
            [
                [3, 19],
                [41, 17],
            ],

            [
                [29, 70],
                [11, 13],
            ],
        ];

        expect(myNArray.sum().real[0]).toStrictEqual(output);
        expect(myNArray.sum(1).real).toStrictEqual(output1);
        expect(myNArray.sum(2).real).toStrictEqual(output2);
        expect(myNArray.sum(3).real).toStrictEqual(output3);
    });
});
