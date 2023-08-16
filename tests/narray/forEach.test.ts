import NArray from "../../narray";

test("NArray forEach Test", () => {
  // forEach(func: Function) iters through the element irrespective of the NArray's shape
  let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  let myNArray = new NArray(myArray);

  myNArray.forEach((e, i) => {
    expect(e).toBe(myArray[i]);
  });
});
