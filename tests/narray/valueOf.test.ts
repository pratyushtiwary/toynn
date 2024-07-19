import NArray from '../../narray';

test('NArray valueOf test', () => {
    const myNarray = new NArray([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]).reshape(2, 4, 2);

    const output = [
        [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
        ],
        [
            [9, 10],
            [11, 12],
            [13, 14],
            [15, 16],
        ],
    ];

    expect(myNarray.valueOf()).toStrictEqual(output);
});
