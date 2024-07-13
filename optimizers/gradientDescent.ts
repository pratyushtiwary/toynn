import NArray from "@/narray";
import Optimizer from "./base";
import { Layer } from "@/nn";

import type {
  GradientDescentInput,
  OptimizerInput,
  OptimizerOutput,
} from "./types";

/**
 *
 * References:
 *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
 *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
 *  - https://stackoverflow.com/a/13342725
 */
export default class GradientDescent extends Optimizer {
  protected momentum: number;
  protected weightsHistory: Array<NArray> = [];
  protected biasHistory: Array<NArray> = [];
  protected EPSILON: number = Number.EPSILON;

  constructor(options: GradientDescentInput = { momentum: 0.9 }) {
    super();
    if (options.momentum > 1 || options.momentum < 0) {
      throw Error(`Value for momentum should be between 0 and 1.`);
    }
    this.momentum = options.momentum;
  }

  protected calcUpdates(
    layers: Layer[],
    weightGradients: NArray[],
    biasGradients: NArray[]
  ): Array<NArray[]> {
    const adjustedWeights = [],
      adjustedBiases = [];

    for (let i = 0; i < layers.length; i++) {
      if (weightGradients[i] instanceof NArray) {
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

  _optimize({ x, y, layers }: OptimizerInput): OptimizerOutput {
    const layersOp = [], // keeps track of each layer's output
      weightGradients: NArray[] = [],
      biasGradients: NArray[] = [],
      weightErrors: NArray[] = []; // keeps track of weights errors
    let recent: NArray;

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
        this.weightsHistory.push(NArray.zeros(...layers[i].shape));
        this.biasHistory.push(NArray.zeros(1, layers[i].shape[1]));
      }
    }

    // calculate errors and gradient for weight and gradient for bias
    for (let i = layers.length - 2; i >= 0; i--) {
      weightErrors[i] = layers[i + 1].weights.dot(weightGradients[i + 1].T);
      weightGradients[i] = weightErrors[i].T.mul(
        layers[i].activationFunction.calcGradient(layersOp[i])
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
      biasGradients
    );

    return {
      weightGradients,
      biasGradients,
      adjustedWeights,
      adjustedBiases,
    };
  }

  optimize({ x, y, layers }: OptimizerInput): void {
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

  public get steps() {
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
