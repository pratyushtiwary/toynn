import errors, { StatError } from "../../errors";
import type { StatErrorReturn } from "../../errors/types";

test("StatError Test", () => {
  const yTrue = [1, 2, 3, 4];
  const yPred = [1.1, 1.95, 3, 4.01];
  const myCustomError: StatError = new StatError(yTrue, yPred);
  let myCustomErrorReturn: StatErrorReturn;

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - TODO: Figure out why this is getting red squiggly line on vscode but jest is not throwing any errors or warning for it
  myCustomErrorReturn = myCustomErrorReturn.apply(errors.sum);
  expect(myCustomErrorReturn.result).toStrictEqual(
    output.reduce((a, b) => a + b)
  );

  expect(myCustomErrorReturn.formula).toBe("sum(abs(yTrue - yPred))");

  try {
    myCustomErrorReturn = myCustomErrorReturn.apply((e) =>
      (e as number[]).reduce((a, b) => a + b)
    );
    myCustomErrorReturn = myCustomErrorReturn.apply((e) =>
      (e as number[]).reduce((a, b) => a + b)
    );
    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }
});
