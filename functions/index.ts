import NArray from "../narray";

export type ActivationFunctionResult = NArray;
export type ActivationFunctionInput = NArray;

export interface ActivationFunctionType {
  formula: string;
  gradient: string;
  calcGradient: (x: ActivationFunctionResult) => ActivationFunctionResult;
  calculate: (x: ActivationFunctionInput) => ActivationFunctionResult;
  toString: () => string;
}

export class ActivationFunction {
  /**
   * Made to act as a base class for activation functions
   *
   * Reference: https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/
   */

  get formula(): string {
    throw Error(`Formula for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the formula getter with the formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }

  get gradient(): string {
    throw Error(`Gradient for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the gradient getter with the gradient formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    throw Error(`Gradient Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calcGradient function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    throw Error(`Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calculate function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }

  toString(): string {
    throw Error(`Name for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the toString function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
  }
}

class Sigmoid extends ActivationFunction {
  get formula() {
    return "1/(1+e^-x)";
  }

  get gradient() {
    return "sigmoid(x)*(1-sigmoid(x))";
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    // multiplied by -1 cause it's 1-sigmoid(x)
    return x.mul(x.sub(1).mul(-1));
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => 1 / (1 + Math.pow(Math.E, -e)));

    return new NArray(result);
  }

  toString() {
    return "sigmoid";
  }
}

class Relu extends ActivationFunction {
  get formula() {
    return `x, x>=0, 0, x<0`;
  }

  get gradient() {
    return `1, x>0, 0, x<=0`;
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    return x.map((e: number) => (e >= 0 ? 1 : 0));
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => Math.max(0, e));

    return new NArray(result);
  }

  toString() {
    return "relu";
  }
}

class LeakyRelu extends ActivationFunction {
  get formula() {
    return `x, x>=0, 0.01x, x<0`;
  }

  get gradient() {
    return `1, x>0, 0.01, x<=0`;
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    return x.map((e: number) => (e >= 0 ? 1 : 0.01));
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => Math.max(0.01 * e, e));

    return new NArray(result);
  }

  toString() {
    return "leakyRelu";
  }
}

class Softmax extends ActivationFunction {
  get formula() {
    return "exp(xi)/sum(exp(x))";
  }

  get gradient() {
    return `x.diag().sub(x.T.dot(x)).sum(0)

    Note: X is a 1 dimensional array
    Axis 0 means column wise sum`;
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    /**
     * Reference: https://github.com/2015xli/multilayer-perceptron/blob/master/multilayer-perceptron-batch.ipynb
     */
    return x.diag().sub(x.T.dot(x)).sum(0);
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const eulerNo = Math.E;
    const summEx = x.map((e) => Math.pow(eulerNo, e)).reduce((a, b) => a + b);
    if (summEx === Infinity) {
      console.warn(
        `Softmax Activation Function results might come in NaN or Infinity, try using different activation function.

        What does this means?
        Some the passed values are very large which results exponential sum of them to reach infinity.

        How can i fix this?
        Either scale down the values or try different activation function`,
      );
    }
    const result = x.map((e) => Math.pow(eulerNo, e) / summEx);

    return new NArray(result);
  }

  toString() {
    return "softmax";
  }
}

class Tanh extends ActivationFunction {
  get formula() {
    return "2 * sigmoid(2x) - 1";
  }

  get gradient() {
    return "1 - tanh^2(x)";
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    // multiplied by -1 cause it's 1 - tanh^2(x)
    return x.pow(2).sub(1).mul(-1);
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e) => 2 / (1 + Math.pow(Math.E, -2 * e)) - 1);

    return new NArray(result);
  }

  toString() {
    return "tanh";
  }
}

class Linear extends ActivationFunction {
  #a = undefined;

  constructor(a = 1) {
    super();
    this.#a = a;
  }

  get formula() {
    return "a*x";
  }

  get gradient() {
    return "a";
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    return x.map(() => this.#a);
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => e * this.#a);

    return new NArray(result);
  }

  toString() {
    return `linear(${this.#a})`;
  }
}

const functions = {
  sigmoid: new Sigmoid(),
  relu: new Relu(),
  leakyRelu: new LeakyRelu(),
  softmax: new Softmax(),
  tanh: new Tanh(),
  linear: new Linear(),
  Sigmoid,
  Relu,
  LeakyRelu,
  Softmax,
  Tanh,
  Linear,
};

export default {
  ...functions,
  ActivationFunction,
};
