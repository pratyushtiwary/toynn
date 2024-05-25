import { Dataset } from "../../dataset";
import NArray from "../../narray";
import { Optimizer } from "../../optimizers";

test("Optimizer class test", () => {
  const optimizer = new Optimizer();

  optimizer.alpha = 0.1;

  expect(optimizer.alpha).toBe(0.1);

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

  try {
    optimizer.optimize({
      x: new NArray([1, 2, 3]),
      y: new NArray([4, 5, 6]),
      layers: [],
    });

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }

  try {
    optimizer.steps;

    expect(true).toBe(false);
  } catch (_) {
    expect(true).toBe(true);
  }
});
