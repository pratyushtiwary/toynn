import errors, { type StatErrorReturn } from "../../errors";

describe("In-built errors tests", () => {
  const yTrue = [4, 8, 10, 5];
  const yPred = [5, 7.5, 9, 4.9];

  test("error test", () => {
    const result: StatErrorReturn = errors.error(yTrue, yPred);

    const output = [-1, 0.5, 1, 0.09999999999999964];
    const formula = "yTrue - yPred";

    expect(result.result).toStrictEqual(output);
    expect(result.formula).toBe(formula);
  });

  test("RSS test", () => {
    const result: StatErrorReturn = errors.RSS(yTrue, yPred);

    const output = 2.26;
    const formula = "sum(square(yTrue - yPred))";

    expect(result.result).toBe(output);
    expect(result.formula).toBe(formula);
  });

  test("MSE test", () => {
    const result: StatErrorReturn = errors.MSE(yTrue, yPred);

    const output = 0.565;
    const formula = "mean(square(yTrue - yPred))";

    expect(result.result).toBe(output);
    expect(result.formula).toBe(formula);
  });

  test("MAE test", () => {
    const result: StatErrorReturn = errors.MAE(yTrue, yPred);

    const output = 0.6499999999999999;
    const formula = "mean(abs(yTrue - yPred))";

    expect(result.result).toBe(output);
    expect(result.formula).toBe(formula);
  });

  test("RMSE test", () => {
    const result: StatErrorReturn = errors.RMSE(yTrue, yPred);

    const output = 0.7516648189186453;
    const formula = "sqrt(mean(square(yTrue - yPred)))";

    expect(result.result).toBe(output);
    expect(result.formula).toBe(formula);
  });
});
