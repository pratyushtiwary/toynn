import errors from "../errors";
import { StatErrorReturn, StatErrorInput } from "../errors";
import { ActivationFunction, ActivationFunctionType } from "../functions";
import optimizers, { Optimizer, GradientDescent } from "../optimizers";
import NArray from "../narray";

let nLayer = 0;

interface BackPropInput {
  x: Array<any> | NArray;
  y: Array<any> | NArray;
  alpha?: number;
  optimizer?: Optimizer;
}

interface TrainInput extends BackPropInput {
  x: Array<NArray>;
  y: Array<NArray>;
  epochs: number;
  verbose?: boolean;
  loss?: (yTrue: StatErrorInput, yPred: StatErrorInput) => StatErrorReturn;
}

export class NN {
  #layers: Array<Layer> = [];
  #name: String = undefined;

  constructor(name: String) {
    /**
     * Takes in a name and allows users to create a skeleton which holds layer and activation function
     * Object of this class also allows user to backpropogate and predict
     *
     * @param name: str -> Name of the model. This name will later be used to load and save model
     *
     * Reference: https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
     */
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  add(obj: Layer) {
    /**
     * Adds a layer or activation function to the neural network
     *
     * @param obj: <Layer, Function>
     */
    if (obj instanceof Layer) {
      const [inputSize, _] = obj.shape;

      if (this.#layers.length > 0) {
        const [_, prevOutputSize] =
          this.#layers[this.#layers.length - 1]?.shape;

        if (inputSize !== prevOutputSize) {
          throw Error(
            `Layer's input size doesn't match with previous layer's output size! Make sure the output of previous layer is equal to the input of this layer
            
            How to fix this?
            Make sure that layer ${
              this.#layers.length + 1
            }'s input size = ${prevOutputSize}`
          );
        }
      }
      this.#layers.push(obj);
    } else {
      throw Error(`Unable to add the passed object to the model's pipeline.
      
      How to fix this?
      The object you passed to is not a Layer, try to pass Layer's object`);
    }
  }

  forward(x: Array<any> | NArray): NArray {
    if (!(x instanceof NArray) && x instanceof Array) {
      x = new NArray(x);
    } else if (!(x instanceof NArray)) {
      throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your x to NArray`);
    }
    let recent: NArray;
    this.#layers.forEach((e: Layer, i: number) => {
      if (i === 0) {
        recent = e.forward(x);
      } else {
        recent = e.forward(recent);
      }
    });

    return recent;
  }

  #backprop({
    x,
    y,
    alpha = 0.001,
    optimizer = new GradientDescent(alpha),
  }: BackPropInput) {
    if (!(x instanceof NArray) && x instanceof Array) {
      x = new NArray(x);
    } else if (!(x instanceof NArray)) {
      throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your x to NArray`);
    }
    if (!(y instanceof NArray) && y instanceof Array) {
      y = new NArray(y);
    } else if (!(y instanceof NArray)) {
      throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your y to NArray`);
    }
    optimizer.optimize({
      x,
      y,
      layers: this.#layers,
    });
  }

  train({
    x,
    y,
    epochs,
    alpha = 0.001,
    verbose = false,
    loss = errors.RSS,
    optimizer = new GradientDescent(alpha),
  }: TrainInput) {
    let losses = [],
      accuracies = [],
      l: Array<any>;
    ({ x, y } = optimizer.process(x, y));
    for (let i = 0; i < epochs; i++) {
      l = [];
      for (let j = 0; j < x.length; j++) {
        if (!(x[j] instanceof NArray)) {
          throw Error(`Make sure x's elements both are of type NArray`);
        }
        let out = this.forward(x[j]);
        if (!(y[j] instanceof NArray)) {
          throw Error(`Make sure y's elements are of type NArray`);
        }
        l.push(loss(y[j].flatten(), out.flatten()).result);
        this.#backprop({
          x: x[j],
          y: y[j],
          alpha,
          optimizer,
        });
      }
      losses[i] = errors.mean(l);
      accuracies[i] = 1 - losses[i];
      if (verbose) {
        console.log(`Epoch: ${i + 1}, accuracy: ${accuracies[i] * 100}`);
      }
    }
    return [losses, accuracies];
  }
}

export class Layer {
  #weights: NArray = undefined;
  #bias: NArray = undefined;
  inputSize: number = 0;
  outputSize: number = 0;
  #activationFunction: ActivationFunction = undefined;
  name: String = undefined;

  constructor(inputSize: number, outputSize: number) {
    /**
     * Single layer in the neural network
     *
     * @param inputSize: int
     * @param outputSize: int
     */
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    nLayer++;

    this.#weights = this.#generateWeights(inputSize, outputSize);
    this.#bias = this.#generateWeights(1, outputSize);
  }

  #generateWeights(x: number, y: number): NArray {
    let tempWeights = [];

    for (let i = 0; i < x * y; i++) {
      tempWeights[i] = NArray.randn();
    }

    return new NArray(tempWeights).reshape(x, y);
  }

  get weights() {
    return this.#weights;
  }

  get bias() {
    return this.#bias;
  }

  set weights(newWeights: NArray) {
    if (!(newWeights instanceof NArray)) {
      throw Error(`Weights should be of type NArray.
      
      How to fix this?
      Convert your new weights to NArray by using new NArray(yourNewWeights)`);
    }
    if (newWeights.ndim !== 2) {
      throw Error(`Weights should be a 2-dim NArray
      
      How to fix this?
      Try reshaping your weights`);
    }

    if (newWeights.shape[0] !== this.inputSize) {
      throw Error(`Shape mismatch the input size.
      
      How to fix this?
      Make sure your weights 0th dim is of size ${this.inputSize}`);
    }

    if (newWeights.shape[1] !== this.outputSize) {
      throw Error(`Shape mismatch the output size.
      
      How to fix this?
      Make sure your weights 1st dim is of size ${this.outputSize}`);
    }

    this.#weights = newWeights;
  }

  set bias(newBias: NArray) {
    if (!(newBias instanceof NArray)) {
      throw Error(`Bias should be of type NArray.
      
      How to fix this?
      Convert your new weights to NArray by using new NArray(yourNewWeights)`);
    }
    if (newBias.ndim !== 2) {
      throw Error(`Bias should be a 2-dim NArray
      
      How to fix this?
      Try reshaping your weights`);
    }

    if (newBias.shape[0] !== 1) {
      throw Error(`Shape mismatch.
      
      How to fix this?
      Make sure your bias 0th dim is of size 1`);
    }

    if (newBias.shape[1] !== this.outputSize) {
      throw Error(`Shape mismatch the output size.
      
      How to fix this?
      Make sure your bias 1st dim is of size ${this.outputSize}`);
    }

    this.#bias = newBias;
  }

  forward(x: Array<any> | NArray): NArray {
    if (!(x instanceof NArray) && x instanceof Array) {
      x = new NArray(x);
    } else if (!(x instanceof NArray)) {
      throw Error(`Invalid input for layer ${this.name || nLayer}
      
      Make sure x is of type NArray`);
    }

    if (x.length !== this.inputSize) {
      throw Error(`${x.length}(no. of elems) != ${this.inputSize}(inputSize)
      
      How to fix this?
      Make sure the length of x(${x.length}) = ${this.inputSize}`);
    }

    let z1 = x.dot(this.weights);
    if (!(z1 instanceof NArray)) {
      throw Error(`Invalid result for layer ${this.name}.
      
      What does this mean?
      While trying to compute result for Layer ${this.name} a number is returned rather than an NArray
      
      How can you fix it?
      Try raising an issue if you see this error along with the code for neural network and your training dataset`);
    }
    z1 = z1.add(this.bias);
    let a1 = this.#activationFunction.calculate(z1).reshape(1, this.outputSize);
    return a1;
  }

  get shape() {
    return [this.inputSize, this.outputSize];
  }

  set activationFunction(func: ActivationFunctionType) {
    if (!(func instanceof ActivationFunction)) {
      throw Error(`Invalid activation function.
      
      How to fix this?
      Make sure you've passed object of type ActivationFunction`);
    }

    this.#activationFunction = func;
  }

  use(obj: ActivationFunctionType) {
    this.activationFunction = obj;
  }

  get activationFunction(): ActivationFunction {
    return this.#activationFunction;
  }
}

export default { NN, Layer };