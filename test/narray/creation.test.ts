import NArray from "../../narray";

describe("NArray Creation Tests", () => {
  test("From Array", () => {
    let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let myNArray = new NArray(myArray);

    expect(myNArray.flatten()).toStrictEqual(myArray);
  });

  test("From NArray", () => {
    let myNArray = NArray.arange(32);
    let myNArrayCopy = new NArray(myNArray);

    expect(myNArray.flatten()).toBe(myNArrayCopy.flatten());
  });

  test("Irregular Shape Array", () => {
    let myArray = [[1, 2], [3]];
    try {
      new NArray(myArray);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }
  });
});
