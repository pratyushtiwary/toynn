import { Dataset } from "../../dataset";
import errors from "../../errors";
import functions from "../../functions";
import NArray from "../../narray";
import { Layer } from "../../nn";
import optimizers from "../../optimizers";

describe("GradientDescent tests", () => {
  test("GradientDescent", () => {
    const optimizer = new optimizers.GradientDescent();

    try {
      new optimizers.GradientDescent({
        momentum: 5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      new optimizers.GradientDescent({
        momentum: -5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    optimizer.alpha = 0.01;

    expect(optimizer.alpha).toBe(0.01);

    expect(optimizer.process([1, 2, 3], [4, 5, 6])).toStrictEqual({
      x: [1, 2, 3],
      y: [4, 5, 6],
    });

    const datasetX = new Dataset([new NArray([1, 2, 3])]);

    const datasetY = new Dataset([new NArray([4, 5, 6])]);

    expect(optimizer.process(datasetX, datasetY)).toStrictEqual({
      x: datasetX,
      y: datasetY,
    });

    // create a dummy layer
    const layer1 = new Layer(2, 2);
    layer1.activationFunction = functions.linear;

    layer1.bias = NArray.zeros(1, 2).map(() => 0);
    layer1.weights = NArray.zeros(2, 2).map(() => 0);

    const x = new NArray([1, 2]).reshape(1, -1);
    const y = new NArray([2, 4]);
    const op1 = layer1.forward(x);

    const error1 = errors.MSE(y.flatten(), op1.flatten()).result;

    optimizer.optimize({
      x,
      y,
      layers: [layer1],
    });

    const op2 = layer1.forward(x);
    const error2 = errors.MSE(y.flatten(), op2.flatten()).result;

    if (typeof error1 === "number" && typeof error2 === "number") {
      expect(error2).toBeLessThan(error1);
    } else {
      expect(true).toBe(false);
    }

    expect(optimizer.steps).toBeInstanceOf(Array);
    expect(typeof optimizer.steps[0] === "string").toBe(true);
  });

  test("GD", () => {
    const optimizer = new optimizers.GD();

    try {
      new optimizers.GradientDescent({
        momentum: 5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      new optimizers.GradientDescent({
        momentum: -5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    optimizer.alpha = 0.01;

    expect(optimizer.alpha).toBe(0.01);

    expect(optimizer.process([1, 2, 3], [4, 5, 6])).toStrictEqual({
      x: [1, 2, 3],
      y: [4, 5, 6],
    });

    const datasetX = new Dataset([new NArray([1, 2, 3])]);

    const datasetY = new Dataset([new NArray([4, 5, 6])]);

    expect(optimizer.process(datasetX, datasetY)).toStrictEqual({
      x: datasetX,
      y: datasetY,
    });

    // create a dummy layer
    const layer1 = new Layer(2, 2);
    layer1.activationFunction = functions.linear;
    layer1.bias = NArray.zeros(1, 2).map(() => 0);
    layer1.weights = NArray.zeros(2, 2).map(() => 0);

    const x = new NArray([1, 2]).reshape(1, -1);
    const y = new NArray([2, 4]);
    const op1 = layer1.forward(x);

    const error1 = errors.MSE(y.flatten(), op1.flatten()).result;

    optimizer.optimize({
      x,
      y,
      layers: [layer1],
    });

    const op2 = layer1.forward(x);
    const error2 = errors.MSE(y.flatten(), op2.flatten()).result;

    if (typeof error1 === "number" && typeof error2 === "number") {
      expect(error2).toBeLessThan(error1);
    } else {
      expect(true).toBe(false);
    }

    expect(optimizer.steps).toBeInstanceOf(Array);
    expect(typeof optimizer.steps[0] === "string").toBe(true);
  });
});
