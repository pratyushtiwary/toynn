import NArray from "../../narray";

describe("NArray Mul Tests", () => {
  test("With a number", () => {
    let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let myNArray = new NArray(myArray);

    expect(myNArray.mul(5).real).toStrictEqual(myArray.map((e) => e * 5));
  });

  test("With another NArray [1d]", () => {
    let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let myArray2 = [5, 2, 1, 9, 0, 8, 10, 44, 9, 5];

    let myNArray = new NArray(myArray);
    let myNArray2 = new NArray(myArray2);

    expect(myNArray.mul(myNArray2).real).toStrictEqual(
      myArray.map((e, i) => e * myArray2[i])
    );
  });

  test("With another NArray [Nd]", () => {
    let myArray = [
      [4, 5],
      [8, 9],
      [10, 12],
    ];
    let myArray2 = [5, 2, 1, 9, 0, 8, 9];

    let myNArray = new NArray(myArray);
    let myNArray2 = new NArray(myArray2);

    try {
      myNArray.mul(myNArray2);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    let myArray3 = [
      [5, 2],
      [1, 9],
      [0, 8],
    ];

    myNArray2 = new NArray(myArray3);

    const output = [
      [20, 10],
      [8, 81],
      [0, 96],
    ];

    expect(myNArray.mul(myNArray2).real).toStrictEqual(output);
  });
});
