import fs from "fs";
import path from "path";
import errors from "../errors";
import functions from "../functions";
import { StatErrorReturn, StatErrorInput } from "../errors";
import { ActivationFunction, ActivationFunctionType } from "../functions";
import { Optimizer, GradientDescent } from "../optimizers";
import NArray from "../narray";

let nLayer = 0;

interface TrainInput {
  x: Array<NArray>;
  y: Array<NArray>;
  epochs: number;
  verbose?: boolean;
  alpha?: number;
  optimizer?: Optimizer;
  loss?: (yTrue: StatErrorInput, yPred: StatErrorInput) => StatErrorReturn;
}

interface ModelFileLayer {
  weights: Array<any>;
  bias: Array<any>;
  shape: Array<number>;
  activationFunction: string;
}

export class NN {
  #layers: Array<Layer> = [];
  #name: String = undefined;
  #trained: boolean = false;
  #lastOptimizerUser: Optimizer;

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

  get layers(): Array<Layer> {
    return Array.from(this.#layers);
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

  train({
    x,
    y,
    epochs,
    alpha = 0.001,
    verbose = false,
    loss = errors.RSS,
    optimizer = new GradientDescent(),
  }: TrainInput) {
    this.#trained = true;
    optimizer.alpha = alpha;
    let losses = [],
      accuracies = [],
      l: Array<any>;
    for (let i = 0; i < epochs; i++) {
      ({ x, y } = optimizer.process(x, y));
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
        optimizer.optimize({
          x: x[j],
          y: y[j],
          layers: this.#layers,
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

  get structure(): String {
    let structure = ``;

    this.#layers.forEach((e, i) => {
      structure += `Layer ${i + 1}: (${e.inputSize}, ${
        e.outputSize
      }), activation function: ${e.activationFunction.toString()} \n`;
    });
    structure = structure.replace("\n$", "");
    return structure;
  }

  explain(x: NArray): String {
    let explanation = `\n`;
    let recent: NArray;

    explanation += `No. of layers: ${this.#layers.length}\n`;

    explanation += `Each layers uses the formula: x*weigths + bias\n`;

    this.#layers.forEach((e, i) => {
      if (i === 0) {
        recent = e.forward(x);
        explanation += `Layer 1 output: ${recent.toString()}\n`;
      } else {
        recent = e.forward(recent);
        explanation += `Layer ${i + 1} output: ${recent.toString()}\n`;
      }
    });

    if (this.#trained) {
      explanation += `\n\n----------------- Optimization Steps --------------------\n\n`;
      explanation += this.#lastOptimizerUser.steps
        .map((e) => (e.toLowerCase().startsWith("note") ? e : "- " + e))
        .join("\n");
    }

    return explanation;
  }

  save(savePath: string = "./") {
    const finalPath = path.join(savePath, this.name + ".json");

    const contents = this.#layers.map((e) => ({
      weights: e.weights.real,
      bias: e.bias.real,
      activationFunction: e.activationFunction.toString(),
      shape: e.shape,
    }));

    fs.writeFileSync(finalPath, JSON.stringify(contents, null, 4), "utf-8");
  }

  load(filePath: string) {
    try {
      let data: Array<ModelFileLayer> = JSON.parse(
          fs.readFileSync(filePath, "utf-8")
        ),
        tempLayer: ModelFileLayer,
        tempActivationFunction: ActivationFunction;

      for (let i = 0; i < data.length; i++) {
        tempLayer = data[i];
        this.#layers[i] = new Layer(tempLayer.shape[0], tempLayer.shape[1]);

        this.#layers[i].weights = new NArray(tempLayer.weights);
        this.#layers[i].bias = new NArray(tempLayer.bias);

        // check if activation function exists
        tempActivationFunction = functions[tempLayer.activationFunction];

        if (!tempActivationFunction) {
          throw Error(
            `Failed to load activation function ${
              tempLayer.activationFunction
            } for layer ${i + 1}`
          );
        }

        this.#layers[i].activationFunction = tempActivationFunction;
      }
    } catch (e) {
      throw Error(`Failed to load model.
      
      Error: ${e}`);
    }
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
      Try raising an issue if you see this error along with the code for neural network and your training dataset on https://github.com/pratyushtiwary/toynn`);
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
