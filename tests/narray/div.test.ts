import NArray from "../../narray";

describe("NArray Div Tests", () => {
  test("With a number", () => {
    let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let myNArray = new NArray(myArray);

    expect(myNArray.div(5).real).toStrictEqual(myArray.map((e) => e / 5));
  });

  test("With another NArray [1d]", () => {
    let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let myArray2 = [5, 2, 1, 9, 1, 8, 10, 44, 9, 5];

    let myNArray = new NArray(myArray);
    let myNArray2 = new NArray(myArray2);

    expect(myNArray.div(myNArray2).real).toStrictEqual(
      myArray.map((e, i) => e / myArray2[i])
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
      myNArray.div(myNArray2);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    let myArray3 = [
      [5, 2],
      [1, 9],
      [1, 8],
    ];

    myNArray2 = new NArray(myArray3);

    const output = [
      [0.8, 2.5],
      [8, 1],
      [10, 1.5],
    ];

    const output2 = [
      [1.25, 0.4],
      [0.125, 1],
      [0.1, 0.6666666666666666],
    ];

    expect(myNArray.div(myNArray2).real).toStrictEqual(output);
    expect(myNArray2.div(myNArray).real).toStrictEqual(output2);
  });
});
