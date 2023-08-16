import NArray from "../../narray";

test("NArray Reshape Test", () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const narray = new NArray(array);

  expect(narray.shape).toStrictEqual([array.length]);
  expect(narray.ndim).toBe(1);

  narray.reshape(4, -1);

  expect(narray.shape).toStrictEqual([4, 4]);
  expect(narray.ndim).toBe(2);

  narray.reshape(2, 4, -1);

  expect(narray.shape).toStrictEqual([2, 4, 2]);
  expect(narray.ndim).toBe(3);

  try {
    narray.reshape(-1, -1);

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    narray.reshape(10, 10);

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }
});
