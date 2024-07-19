import NArray from '../../narray';

describe('NArray Transpose Tests', () => {
    test('1d Array', () => {
        const output = [1, 2, 3, 4, 5, 6];
        const narray = new NArray(output);

        expect(narray.T.real).toStrictEqual(output);
        expect(narray.transpose().real).toStrictEqual(output);
    });

    test('2d Array', () => {
        const narray = new NArray([1, 2, 3, 4, 5, 6]).reshape(2, -1);
        const output = [
            [1, 4],
            [2, 5],
            [3, 6],
        ];

        expect(narray.T.real).toStrictEqual(output);
        expect(narray.transpose().real).toStrictEqual(output);
    });

    test('Nd Array', () => {
        const narray = new NArray([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        ]).reshape(4, 2, -1);
        const output = [
            [
                [1, 5, 9, 13],
                [3, 7, 11, 15],
            ],

            [
                [2, 6, 10, 14],
                [4, 8, 12, 16],
            ],
        ];

        expect(narray.T.real).toStrictEqual(output);
        expect(narray.transpose().real).toStrictEqual(output);
    });
});
