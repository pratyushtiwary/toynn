import { ActivationFunction } from "../../functions";
import NArray from "../../narray";

test("ActivationFunction base class test", () => {
  const func = new ActivationFunction();

  const input = new NArray([1, 2, 3, 4]);

  try {
    func.calculate(input);
    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    func.calcGradient(input);

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    func.formula;

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    func.gradient;

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    func.toString();

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }
});
