import errors, { StatError, type StatErrorReturn } from "../../errors";

test("StatError Test", () => {
  const yTrue = [1, 2, 3, 4];
  const yPred = [1.1, 1.95, 3, 4.01];
  let myCustomError: StatError = new StatError(yTrue, yPred);
  let myCustomErrorReturn: StatErrorReturn = undefined;

  try {
    myCustomError.use((a: number) => Math.abs(a));
    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  myCustomErrorReturn = myCustomError.use(Math.abs);

  const output = [
    0.10000000000000009, 0.050000000000000044, 0, 0.009999999999999787,
  ];

  expect(myCustomErrorReturn.result).toStrictEqual(output);

  myCustomErrorReturn = myCustomErrorReturn.apply(errors.sum);
  expect(myCustomErrorReturn.result).toStrictEqual(
    output.reduce((a, b) => a + b),
  );

  expect(myCustomErrorReturn.formula).toBe("sum(abs(yTrue - yPred))");

  try {
    myCustomErrorReturn = myCustomErrorReturn.apply((e: number[]) =>
      e.reduce((a, b) => a + b),
    );

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }
});
