import { Dataset, DatasetSlice } from "../dataset";
import NArray from "../narray";
import { Layer } from "../nn";
import utils from "../utils";

export interface OptimizerProcessReturn {
  x: Array<any> | Dataset | DatasetSlice;
  y: Array<any> | Dataset | DatasetSlice;
}

export interface OptimizerInput {
  x: NArray;
  y: NArray;
  layers: Array<Layer>;
}

export interface OptimizerOutput {
  weightGradients: Array<NArray>;
  biasGradients: Array<NArray>;
  adjustedWeights: Array<NArray>;
  adjustedBiases: Array<NArray>;
}

export interface GradientDescentInput {
  momentum?: number;
}

export class Optimizer {
  alpha: number = undefined;

  public process(
    x: Array<any> | Dataset | DatasetSlice,
    y: Array<any> | Dataset | DatasetSlice
  ): OptimizerProcessReturn {
    return { x, y };
  }

  public optimize({ x, y, layers }: OptimizerInput): void {
    throw Error(`Method not implemented!
    
    How can you fix this?
    Try overloading the optimize method.`);
  }

  public get steps(): Array<String> {
    throw Error(`Steps not implemented.
    
    How to fix this?
    If you are the developer, try overwritting the steps getter,
    Else, try raising an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }
}

export class GradientDescent extends Optimizer {
  /**
   *
   * References:
   *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
   *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
   *  - https://stackoverflow.com/a/13342725
   */

  protected firstRun: boolean = true;
  protected momentum: number;
  protected weightsHistory: Array<NArray> = [];
  protected biasHistory: Array<NArray> = [];

  constructor({ momentum = 0.9 }: GradientDescentInput) {
    super();
    if (momentum > 1 || momentum < 0) {
      throw Error(`Value for momentum should be between 0 and 1.`);
    }
    this.momentum = momentum;
  }

  _optimize({ x, y, layers }: OptimizerInput): OptimizerOutput {
    let layersOp = [], // keeps track of each layer's output
      recent: NArray,
      weightGradients = [],
      biasGradients = [],
      weightErrors = [], // keeps track of weights errors
      adjustedWeights = [], // keeps track of new weights
      adjustedBiases = [];

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

    // calculate errors and gradient for weight and gradient for bias
    for (let i = layers.length - 2; i >= 0; i--) {
      weightErrors[i] = layers[i + 1].weights.dot(weightGradients[i + 1].T);
      weightGradients[i] = weightErrors[i].T.mul(
        layers[i].activationFunction.calcGradient(layersOp[i])
      );

      biasGradients[i] = layers[i].activationFunction.calcGradient(layersOp[i]);
    }

    if (this.weightsHistory.length === 0 && this.biasHistory.length === 0) {
      for (let i = 0; i < layers.length; i++) {
        this.weightsHistory.push(NArray.zeroes(...layers[i].shape));
        this.biasHistory.push(NArray.zeroes(1, layers[i].shape[1]));
      }
      this.firstRun = false;
    }
    for (let i = 0; i < layers.length; i++) {
      if (i === 0) {
        weightGradients[0] = x.T.dot(weightGradients[0]);
      } else {
        weightGradients[i] = layersOp[i - 1].T.dot(weightGradients[i]);
      }

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
      "Update the histroy for weights with the output from previous step",
      "Now again iterate through layers and add the weights histroy to that layer's weight",
      "For bias, simply find the gradient of each layer's output",
      "Calculate histroy using the same method for bias",
      "Then add the histroy to that layer's bias",
      "Note: You can get gradient for activation functions by using `activationFunction.gradient`",
    ];
  }
}

export class StochasticGradientDescent extends GradientDescent {
  process(
    x: any[] | Dataset | DatasetSlice,
    y: any[] | Dataset | DatasetSlice
  ): OptimizerProcessReturn {
    if (x.length !== y.length) {
      throw Error(`X and Y length mismatch
      
      How can you fix it?
      Make sure that the X and Y passed are of the same length.`);
    }
    let shuffledX: any[] | DatasetSlice, shuffledY: any[] | DatasetSlice;

    let xLen = x.length;

    const arrangement = utils.shuffle(xLen);

    if (!(arrangement instanceof Array)) {
      throw Error(
        `SGD: Failed to shuffle data. utils.shuffle returned unexpected value.`
      );
    }

    if (x instanceof Dataset || x instanceof DatasetSlice) {
      shuffledX = new DatasetSlice(x, arrangement);
    }

    if (x instanceof Array) {
      shuffledX = [];
      for (let i = 0; i < xLen; i++) {
        shuffledX[i] = x[arrangement[i]];
      }
    }

    if (y instanceof Dataset || y instanceof DatasetSlice) {
      shuffledY = new DatasetSlice(y, arrangement);
    }

    if (y instanceof Array) {
      shuffledY = [];
      for (let i = 0; i < xLen; i++) {
        shuffledY[i] = y[arrangement[i]];
      }
    }

    return { x: shuffledX, y: shuffledY };
  }

  public get steps() {
    return [
      "Shuffle x and y passed before each epochs, then for each epoch follow the below steps",
      ...super.steps,
    ];
  }
}

export default {
  Optimizer,
  GradientDescent,
  StochasticGradientDescent,
  GD: GradientDescent,
  SGD: StochasticGradientDescent,
};
