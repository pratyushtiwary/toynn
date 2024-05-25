"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.StochasticGradientDescent =
  exports.GradientDescent =
  exports.Optimizer =
    void 0;
const dataset_1 = require("../dataset");
const narray_1 = __importDefault(require("../narray"));
const utils_1 = __importDefault(require("../utils"));
class Optimizer {
  constructor() {
    this.alpha = undefined;
  }
  process(x, y) {
    return { x, y };
  }
  optimize({ x, y, layers }) {
    throw Error(`Method not implemented!

    How can you fix this?
    Try overloading the optimize method.`);
  }
  get steps() {
    throw Error(`Steps not implemented.

    How to fix this?
    If you are the developer, try overwritting the steps getter,
    Else, try raising an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }
}
exports.Optimizer = Optimizer;
/**
 *
 * References:
 *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
 *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
 *  - https://stackoverflow.com/a/13342725
 */
class GradientDescent extends Optimizer {
  constructor(options = { momentum: 0.9 }) {
    super();
    this.weightsHistory = [];
    this.biasHistory = [];
    this.EPSILON = Number.EPSILON;
    if (options.momentum > 1 || options.momentum < 0) {
      throw Error(`Value for momentum should be between 0 and 1.`);
    }
    this.momentum = options.momentum;
  }
  calcUpdates(layers, weightGradients, biasGradients) {
    let adjustedWeights = [],
      adjustedBiases = [];
    for (let i = 0; i < layers.length; i++) {
      if (weightGradients[i] instanceof narray_1.default) {
        // momentum logic for weights
        this.weightsHistory[i] = this.weightsHistory[i]
          .mul(this.momentum)
          .sub(weightGradients[i].mul(this.alpha));
        adjustedWeights[i] = layers[i].weights.add(this.weightsHistory[i]);
      }
      // momentum logic for bias
      this.biasHistory[i] = this.biasHistory[i]
        .mul(this.momentum)
        .sub(biasGradients[i].mul(this.alpha));
      adjustedBiases[i] = layers[i].bias.add(this.biasHistory[i]);
    }
    return [adjustedBiases, adjustedWeights];
  }
  _optimize({ x, y, layers }) {
    let layersOp = [], // keeps track of each layer's output
      recent,
      weightGradients = [],
      biasGradients = [],
      weightErrors = []; // keeps track of weights errors
    layers.forEach((e, i) => {
      if (i === 0) {
        recent = e.forward(x);
      } else {
        recent = e.forward(recent);
      }
      layersOp.push(recent);
    });
    weightGradients[layersOp.length - 1] = layersOp[layersOp.length - 1].sub(y);
    biasGradients[layersOp.length - 1] = layers[
      layersOp.length - 1
    ].activationFunction.calcGradient(layersOp[layersOp.length - 1].sub(y));
    let j = 0;
    if (this.weightsHistory.length === 0 && this.biasHistory.length === 0) {
      for (let i = 0; i < layers.length; i++) {
        this.weightsHistory.push(narray_1.default.zeros(...layers[i].shape));
        this.biasHistory.push(narray_1.default.zeros(1, layers[i].shape[1]));
      }
    }
    // calculate errors and gradient for weight and gradient for bias
    for (let i = layers.length - 2; i >= 0; i--) {
      weightErrors[i] = layers[i + 1].weights.dot(weightGradients[i + 1].T);
      weightGradients[i] = weightErrors[i].T.mul(
        layers[i].activationFunction.calcGradient(layersOp[i]),
      );
      biasGradients[i] = layers[i].activationFunction.calcGradient(layersOp[i]);
      if (j === 0) {
        weightGradients[0] = x.T.dot(weightGradients[0]);
      } else {
        weightGradients[j] = layersOp[j - 1].T.dot(weightGradients[j]);
      }
      j++;
    }
    if (layers.length > 1) {
      weightGradients[j] = layersOp[j - 1].T.dot(weightGradients[j]);
    }
    if (layers.length === 1) {
      weightGradients[0] = x.T.dot(weightGradients[0]);
    }
    const [adjustedBiases, adjustedWeights] = this.calcUpdates(
      layers,
      weightGradients,
      biasGradients,
    );
    return {
      weightGradients,
      biasGradients,
      adjustedWeights,
      adjustedBiases,
    };
  }
  optimize({ x, y, layers }) {
    const { adjustedWeights, adjustedBiases } = this._optimize({
      x,
      y,
      layers,
    });
    // update these new weights and biases
    for (let i = 0; i < layers.length; i++) {
      layers[i].weights = adjustedWeights[i];
      layers[i].bias = adjustedBiases[i];
    }
  }
  get steps() {
    return [
      "Find the error, using y^ - y",
      "Start from last layer's weights dot product by the transpose of the error, this will provide error for second last layer",
      "Perform the above step iteratively for each layer",
      "Now that we have each layer's error, iteratively multiply the error's transpose with gradient of that layer's output, this will provide us with layer's gradient",
      "Now once we have the layer's gradient, multiply the gradient with the x's transpose provided by you for the 1st layer",
      "For 2nd layer till n layer multiply previous layer output's transpose by that layer's gradient",
      "For the first time set weights and bias history to 0",
      "For each layer calculate the weigths history by multiplying the history with momentum and subtract layer's gradient * alpha",
      "Update the history for weights with the output from previous step",
      "Now again iterate through layers and add the weights history from that layer's weight",
      "For bias, simply find the gradient of each layer's output",
      "Calculate history using the same method for bias",
      "Then add the history to that layer's bias",
      "Note: You can get gradient for activation functions by using `activationFunction.gradient`",
    ];
  }
}
exports.GradientDescent = GradientDescent;
class StochasticGradientDescent extends GradientDescent {
  process(x, y) {
    if (x.length !== y.length) {
      throw Error(`X and Y length mismatch

      How can you fix it?
      Make sure that the X and Y passed are of the same length.`);
    }
    let shuffledX, shuffledY;
    let xLen = x.length;
    const arrangement = utils_1.default.shuffle(xLen);
    if (!(arrangement instanceof Array)) {
      throw Error(
        `SGD: Failed to shuffle data. utils.shuffle returned unexpected value.`,
      );
    }
    if (x instanceof dataset_1.Dataset || x instanceof dataset_1.DatasetSlice) {
      shuffledX = new dataset_1.DatasetSlice(x, arrangement);
    }
    if (x instanceof Array) {
      shuffledX = [];
      for (let i = 0; i < xLen; i++) {
        shuffledX[i] = x[arrangement[i]];
      }
    }
    if (y instanceof dataset_1.Dataset || y instanceof dataset_1.DatasetSlice) {
      shuffledY = new dataset_1.DatasetSlice(y, arrangement);
    }
    if (y instanceof Array) {
      shuffledY = [];
      for (let i = 0; i < xLen; i++) {
        shuffledY[i] = y[arrangement[i]];
      }
    }
    return { x: shuffledX, y: shuffledY };
  }
  get steps() {
    return [
      "Shuffle x and y passed before each epochs, then for each epoch follow the below steps",
      ...super.steps,
    ];
  }
}
exports.StochasticGradientDescent = StochasticGradientDescent;
class RMSProp extends StochasticGradientDescent {
  calcUpdates(layers, weightGradients, biasGradients) {
    let adjustedBiases = [],
      adjustedWeights = [];
    for (let i = 0; i < layers.length; i++) {
      if (weightGradients[i] instanceof narray_1.default) {
        // momentum logic for weights
        this.weightsHistory[i] = this.weightsHistory[i]
          .mul(this.momentum)
          .add(weightGradients[i].pow(2).mul(1 - this.momentum));
        adjustedWeights[i] = layers[i].weights.sub(
          weightGradients[i]
            .div(this.weightsHistory[i].add(this.EPSILON).map(Math.sqrt))
            .mul(this.alpha),
        );
      }
      // momentum logic for bias
      this.biasHistory[i] = this.biasHistory[i]
        .mul(this.momentum)
        .add(biasGradients[i].pow(2).mul(1 - this.momentum));
      adjustedBiases[i] = layers[i].bias.sub(
        biasGradients[i]
          .div(this.biasHistory[i].add(this.EPSILON).map(Math.sqrt))
          .mul(this.alpha),
      );
    }
    return [adjustedBiases, adjustedWeights];
  }
  get steps() {
    return [
      ...super.steps.slice(0, 8),
      "For each layer calculate the weigths history by multiplying the history with momentum and add layer's gradient^2 * (1-momentum)",
      super.steps[10],
      "Now again iterate through layers and subtract the weights gradient divided by square root of (weight history + EPSILON) from that layer's weight",
      ...super.steps.slice(12),
    ];
  }
}
exports.default = {
  Optimizer,
  GradientDescent,
  StochasticGradientDescent,
  GD: GradientDescent,
  SGD: StochasticGradientDescent,
  RMSProp,
};
