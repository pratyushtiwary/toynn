import NArray from '../../narray';

test('NArray Get Test', () => {
    const narray = new NArray([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);

    narray.reshape(2, 4, -1);

    const output1 = [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
    ];

    const output2 = [9, 10];
    const output3 = 10;
    const output4 = 16;

    expect(narray.get(0)).toStrictEqual(output1);
    expect(narray.get(1, 0)).toStrictEqual(output2);
    expect(narray.get(1, 0, 1)).toStrictEqual(output3);
    expect(narray.get(-1, -1, -1)).toStrictEqual(output4);

    try {
        narray.get(4, 3, 2, 1);

        expect(true).toBe(false);
    } catch (_) {
        expect(true).toBe(true);
    }
});
