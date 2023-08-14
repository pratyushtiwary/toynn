import NArray from "../../narray";

describe("NArray Diag Tests", () => {
  test("1d Array", () => {
    // output is from numpy
    const myArray = [1, 2, 3, 4, 5, 6, 7, 8];
    const myNArray = new NArray(myArray);
    const output = [
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0],
      [0, 0, 0, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 0, 7, 0],
      [0, 0, 0, 0, 0, 0, 0, 8],
    ];
    expect(myNArray.diag().real).toStrictEqual(output);
  });

  test("2d Array", () => {
    // output is from numpy
    const myArray = [
      [1, 2],
      [3, 4],
      [6, 5],
      [7, 8],
      [9, 10],
    ];
    const myNArray = new NArray(myArray);
    const output = [1, 4];
    expect(myNArray.diag().real).toStrictEqual(output);
  });

  test("Nd Array", () => {
    // should throw Error cause ndim > 2
    const myArray = [
      [[1], [2]],
      [[3], [4]],
      [[6], [5]],
      [[7], [8]],
      [[9], [10]],
    ];
    const myNArray = new NArray(myArray);
    try {
      myNArray.diag();
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }
  });
});
