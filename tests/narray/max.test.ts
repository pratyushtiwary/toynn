import NArray from '../../narray';

describe('NArray Map Tests', () => {
    test('With positive numbers', () => {
        const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9];
        const myNArray = new NArray(myArray);

        const max = myNArray.max();

        expect(max.element).toBe(10);
        expect(max.index).toBe(8);
    });

    test('With negative and positive numbers', () => {
        const myArray = [1, -2, 3, 4, -5, 6, 7, 8, 10, 9];
        const myNArray = new NArray(myArray);

        const max = myNArray.max();

        expect(max.element).toBe(10);
        expect(max.index).toBe(8);
    });

    test('With negative numbers', () => {
        const myArray = [-2, -1, -3, -4, -5, -6, -7, -8, -10, -9];
        const myNArray = new NArray(myArray);

        const max = myNArray.max();

        expect(max.element).toBe(-1);
        expect(max.index).toBe(1);
    });

    test('With same numbers', () => {
        const myArray = [1, 1, 1, 1, 1, 1];
        const myNArray = new NArray(myArray);

        const max = myNArray.max();

        expect(max.element).toBe(1);
        expect(max.index).toBe(0);
    });
});
