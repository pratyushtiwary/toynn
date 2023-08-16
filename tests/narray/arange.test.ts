import NArray from "../../narray";

describe("NArray arange tests", () => {
  test("without any arguments", () => {
    const output = [];

    expect(NArray.arange().real).toStrictEqual(output);
  });

  test("with single arguments", () => {
    const output = [0, 1, 2, 3, 4];

    expect(NArray.arange(5).real).toStrictEqual(output);
  });

  test("with start and end arguments", () => {
    const output = [1, 2, 3, 4];

    expect(NArray.arange(1, 5).real).toStrictEqual(output);
  });

  test("with start, end and step arguments", () => {
    const output = [1, 3];

    expect(NArray.arange(1, 5, 2).real).toStrictEqual(output);
  });
});
