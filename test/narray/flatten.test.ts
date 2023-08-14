import NArray from "../../narray";

describe("NArray Flatten Tests", () => {
  test("Two Dimension", () => {
    let myArray = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    let output = [1, 2, 3, 4, 5, 6];

    let myNArray = new NArray(myArray);

    expect(myNArray.flatten()).toStrictEqual(output);
  });

  test("N Dimension", () => {
    let myArray = [
      [
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ],
      [
        [
          [9, 10],
          [12, 11],
        ],
        [
          [13, 14],
          [15, 16],
        ],
      ],
    ];
    let output = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11, 13, 14, 15, 16];

    let myNArray = new NArray(myArray);

    expect(myNArray.flatten()).toStrictEqual(output);
  });
});
