import NArray from '../../narray';

describe('NArray zeros tests', () => {
    test('1d NArray', () => {
        const myNarray = NArray.zeros(10);

        expect(myNarray.length).toBe(10);
        expect(myNarray.ndim).toBe(1);
        expect(myNarray.flatten().filter((e) => e === 0).length).toBe(10);
    });

    test('2d NArray', () => {
        const myNarray = NArray.zeros(10, 5);

        expect(myNarray.length).toBe(50);
        expect(myNarray.ndim).toBe(2);
        expect(myNarray.flatten().filter((e) => e === 0).length).toBe(50);
    });

    test('Nd NArray', () => {
        const myNarray = NArray.zeros(10, 5, 2);

        expect(myNarray.length).toBe(100);
        expect(myNarray.ndim).toBe(3);
        expect(myNarray.flatten().filter((e) => e === 0).length).toBe(100);
    });
});
