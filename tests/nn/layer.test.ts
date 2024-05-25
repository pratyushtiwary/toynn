import functions from "../../functions";
import NArray from "../../narray";
import { Layer } from "../../nn";

describe("Layer Tests", () => {
  test("constructor", () => {
    const layer = new Layer(5, 10);

    expect(layer.inputSize).toBe(5);
    expect(layer.outputSize).toBe(10);
  });

  test("weights", () => {
    const layer = new Layer(5, 10);

    expect(layer.weights.shape).toStrictEqual([5, 10]);

    try {
      layer.weights = NArray.zeros(5, 8);
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      layer.weights = NArray.zeros(5, 10, 2);
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      layer.weights = NArray.zeros(5, 10);
      expect(true).toBe(true);
    } catch (_) {
      expect(false).toBe(true);
    }
  });

  test("bias", () => {
    const layer = new Layer(5, 10);

    expect(layer.bias.shape).toStrictEqual([1, 10]);

    try {
      layer.bias = NArray.zeros(1, 8);
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      layer.bias = NArray.zeros(1, 10, 2);
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      layer.bias = NArray.zeros(1, 10);
      expect(true).toBe(true);
    } catch (_) {
      expect(false).toBe(true);
    }
  });

  test("forward", () => {
    const layer = new Layer(2, 2);

    try {
      layer.forward([1, 2, 3]);
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    layer.use(functions.linear);

    expect(layer.activationFunction).toStrictEqual(functions.linear);

    try {
      layer.forward([1, 2]); // shape mismatch
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    const op = layer.forward([[1, 2]]);

    expect(op).toStrictEqual(
      new NArray([[0.38223789826303217, -1.4211215977710612]]),
    );
  });

  test("shape", () => {
    const layer = new Layer(4, 9);

    expect(layer.shape).toStrictEqual([4, 9]);
  });

  test("activationFunction", () => {
    const layer = new Layer(4, 9);

    layer.use(functions.linear);

    expect(layer.activationFunction).toStrictEqual(functions.linear);
  });
});
