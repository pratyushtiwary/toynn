import NArray from '../../narray';

test('NArray Map Test', () => {
    // map(func: Function) maps through the element irrespective of the NArray's shape
    const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const myNArray = new NArray(myArray);

    myNArray.map((e, i) => {
        expect(e).toBe(myArray[i]);
    });
});
