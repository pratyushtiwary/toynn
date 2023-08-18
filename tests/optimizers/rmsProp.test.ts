import { Dataset, DatasetSlice } from "../../dataset";
import errors from "../../errors";
import functions from "../../functions";
import NArray from "../../narray";
import { Layer } from "../../nn";
import optimizers from "../../optimizers";

describe("RMSProp tests", () => {
  test("RMSProp", () => {
    const optimizer = new optimizers.RMSProp();

    try {
      new optimizers.RMSProp({
        momentum: 5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      new optimizers.RMSProp({
        momentum: -5,
      });
      expect(false).toBe(true);
    } catch (_) {
      expect(true).toBe(true);
    }

    optimizer.alpha = 0.01;

    expect(optimizer.alpha).toBe(0.01);

    const { x: processedX, y: processedY } = optimizer.process(
      [1, 2, 3],
      [4, 5, 6]
    );

    if (processedX instanceof Array) {
      expect(processedX.sort()).toStrictEqual([1, 2, 3]);
      expect(processedX).not.toContain([1, 2, 3]);
    } else {
      expect(true).toBe(false);
    }

    if (processedY instanceof Array) {
      expect(processedY.sort()).toStrictEqual([4, 5, 6]);
      expect(processedY).not.toContain([4, 5, 6]);
    } else {
      expect(true).toBe(false);
    }

    let datasetX = new Dataset([new NArray([1, 2, 3]), new NArray([4, 5, 6])]);

    let datasetY = new Dataset([new NArray([1, 2, 3]), new NArray([4, 5, 6])]);

    const { x: processedDatasetX, y: processedDatasetY } = optimizer.process(
      datasetX,
      datasetY
    );

    if (processedDatasetX instanceof DatasetSlice) {
      expect(processedDatasetX.toArray()).toEqual(datasetX.toArray());
      expect(processedDatasetX.toArray()).not.toContain(datasetX.toArray());
    } else {
      expect(true).toBe(false);
    }

    if (processedDatasetY instanceof DatasetSlice) {
      expect(processedDatasetY.toArray()).toEqual(datasetY.toArray());
      expect(processedDatasetY.toArray()).not.toContain(datasetY.toArray());
    } else {
      expect(true).toBe(false);
    }

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
