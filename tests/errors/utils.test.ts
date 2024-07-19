import errors from '../../errors';

describe('util functions tests', () => {
    test('square', () => {
        expect(errors.square(2)).toBe(4);
        expect(errors.square(6)).toBe(36);
        expect(errors.square(10)).toBe(100);
    });

    test('sum', () => {
        expect(errors.sum([1, 2, 3, 4])).toBe(10);
        expect(errors.sum([8, 10, 19, 20])).toBe(57);
        expect(errors.sum([40, 30, 55, 1])).toBe(126);
    });
});
