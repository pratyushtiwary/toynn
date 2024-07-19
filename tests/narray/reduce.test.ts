import NArray from '../../narray';

describe('NArray Reduce Tests', () => {
    test('Elements Sum', () => {
        const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const myNArray = new NArray(myArray);

        expect(myNArray.reduce((a, b) => a + b)).toBe(
            myArray.reduce((a, b) => a + b)
        );
    });

    test('Elements Multiplication', () => {
        const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const myNArray = new NArray(myArray);

        expect(myNArray.reduce((a, b) => a * b)).toBe(
            myArray.reduce((a, b) => a * b)
        );
    });
});
