import NArray from "../../narray";

describe("NArray Dot Tests", () => {
  test("1d Arrays", () => {
    const narray1 = new NArray([1, 2, 3, 4, 5, 6, 7, 8]),
      narray2 = new NArray([2, 4, 6, 8, 10, 12, 14, 16]);

    const output = [408]; // taken from numpy

    expect(narray1.dot(narray2).real).toStrictEqual(output);
  });

  test("2d Arrays", () => {
    const narray1 = new NArray([1, 2, 3, 4, 5, 6, 7, 8]),
      narray2 = new NArray([2, 4, 6, 8, 10, 12, 14, 16]);

    // try illegal dot product
    try {
      narray1.reshape(4, -1);
      narray2.reshape(4, -1);

      narray1.dot(narray2);

      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    narray2.reshape(-1, 4);
    const output = [
      [22, 28, 34, 40],
      [46, 60, 74, 88],
      [70, 92, 114, 136],
      [94, 124, 154, 184],
    ]; // taken from numpy
    const output2 = [
      [100, 120],
      [228, 280],
    ]; // taken from numpy

    expect(narray1.dot(narray2).real).toStrictEqual(output);
    expect(narray2.dot(narray1).real).toStrictEqual(output2);
  });

  test("Nd Arrays", () => {
    const narray1 = new NArray([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]),
      narray2 = new NArray([
        2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
      ]);

    // try illegal dot product
    try {
      narray1.reshape(2, 2, -1);
      narray2.reshape(2, 2, -1);

      narray1.dot(narray2);

      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    narray2.reshape(2, 4, -1);

    const output = [
      [
        [
          [100, 120],
          [260, 280],
        ],

        [
          [228, 280],
          [644, 696],
        ],
      ],

      [
        [
          [356, 440],
          [1028, 1112],
        ],

        [
          [484, 600],
          [1412, 1528],
        ],
      ],
    ]; // taken from numpy

    const output2 = [
      [
        [
          [22, 28, 34, 40],
          [70, 76, 82, 88],
        ],

        [
          [46, 60, 74, 88],
          [158, 172, 186, 200],
        ],

        [
          [70, 92, 114, 136],
          [246, 268, 290, 312],
        ],

        [
          [94, 124, 154, 184],
          [334, 364, 394, 424],
        ],
      ],

      [
        [
          [118, 156, 194, 232],
          [422, 460, 498, 536],
        ],

        [
          [142, 188, 234, 280],
          [510, 556, 602, 648],
        ],

        [
          [166, 220, 274, 328],
          [598, 652, 706, 760],
        ],

        [
          [190, 252, 314, 376],
          [686, 748, 810, 872],
        ],
      ],
    ]; // taken from numpy

    expect(narray1.dot(narray2).real).toStrictEqual(output);
    expect(narray2.dot(narray1).real).toStrictEqual(output2);
  });
});
