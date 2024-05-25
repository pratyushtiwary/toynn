import NArray from "../../narray";

describe("NArray Pow Tests", () => {
  test("With a number", () => {
    const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const myNArray = new NArray(myArray);

    expect(myNArray.pow(2).real).toStrictEqual(
      myArray.map((e) => Math.pow(e, 2)),
    );
  });

  test("With another NArray [1d]", () => {
    const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const myArray2 = [5, 2, 1, 9, 0, 8, 10, 44, 9, 5];

    const myNArray = new NArray(myArray);
    const myNArray2 = new NArray(myArray2);

    expect(myNArray.pow(myNArray2).real).toStrictEqual(
      myArray.map((e, i) => Math.pow(e, myArray2[i])),
    );
  });

  test("With another NArray [Nd]", () => {
    const myArray = [
      [4, 5],
      [8, 9],
      [10, 12],
    ];
    const myArray2 = [5, 2, 1, 9, 0, 8, 9];

    const myNArray = new NArray(myArray);
    let myNArray2 = new NArray(myArray2);

    try {
      myNArray.pow(myNArray2);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    const myArray3 = [
      [5, 2],
      [1, 9],
      [1, 8],
    ];

    myNArray2 = new NArray(myArray3);

    const output = [
      [1024, 25],
      [8, 387420489],
      [10, 429981696],
    ];

    const output2 = [
      [625, 32],
      [1, 387420489],
      [1, 68719476736],
    ];

    expect(myNArray.pow(myNArray2).real).toStrictEqual(output);
    expect(myNArray2.pow(myNArray).real).toStrictEqual(output2);
  });
});
