"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it",
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
          ? (f.value = value)
          : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it",
      );
    return kind === "m"
      ? f
      : kind === "a"
        ? f.call(receiver)
        : f
          ? f.value
          : state.get(receiver);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _NN_layers,
  _NN_name,
  _NN_trained,
  _NN_lastOptimizerUsed,
  _Layer_instances,
  _Layer_weights,
  _Layer_bias,
  _Layer_activationFunction,
  _Layer_generateWeights;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.NN = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataset_1 = require("../dataset");
const errors_1 = __importDefault(require("../errors"));
const functions_1 = __importStar(require("../functions"));
const narray_1 = __importDefault(require("../narray"));
const optimizers_1 = require("../optimizers");
let nLayer = 0;
class NN {
  /**
   * Takes in a name and allows users to create a skeleton which holds layer and activation function
   * Object of this class also allows user to backpropogate and predict
   *
   * @param name: str -> Name of the model. This name will later be used to load and save model
   *
   * Reference: https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
   */
  constructor(name) {
    _NN_layers.set(this, []);
    _NN_name.set(this, undefined);
    _NN_trained.set(this, false);
    _NN_lastOptimizerUsed.set(this, void 0);
    __classPrivateFieldSet(this, _NN_name, name, "f");
  }
  get layers() {
    return Array.from(__classPrivateFieldGet(this, _NN_layers, "f"));
  }
  get name() {
    return __classPrivateFieldGet(this, _NN_name, "f");
  }
  add(obj) {
    var _a;
    /**
     * Adds a layer or activation function to the neural network
     *
     * @param obj: <Layer, Function>
     */
    if (obj instanceof Layer) {
      const [inputSize, _] = obj.shape;
      if (__classPrivateFieldGet(this, _NN_layers, "f").length > 0) {
        const [_, prevOutputSize] =
          (_a = __classPrivateFieldGet(this, _NN_layers, "f")[
            __classPrivateFieldGet(this, _NN_layers, "f").length - 1
          ]) === null || _a === void 0
            ? void 0
            : _a.shape;
        if (inputSize !== prevOutputSize) {
          throw Error(`Layer's input size doesn't match with previous layer's output size! Make sure the output of previous layer is equal to the input of this layer

            How to fix this?
            Make sure that layer ${__classPrivateFieldGet(this, _NN_layers, "f").length + 1}'s input size = ${prevOutputSize}`);
        }
      }
      __classPrivateFieldGet(this, _NN_layers, "f").push(obj);
    } else {
      throw Error(`Unable to add the passed object to the model's pipeline.

      How to fix this?
      The object you passed to is not a Layer, try to pass Layer's object`);
    }
  }
  forward(x) {
    if (!(x instanceof narray_1.default) && x instanceof Array) {
      x = new narray_1.default(x);
    } else if (!(x instanceof narray_1.default)) {
      throw Error(`Invalid input for model ${this.name}

      How to fix this?
      Convert your x to NArray`);
    }
    let recent;
    __classPrivateFieldGet(this, _NN_layers, "f").forEach((e, i) => {
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
    loss = errors_1.default.RSS,
    optimizer = new optimizers_1.GradientDescent(),
  }) {
    __classPrivateFieldSet(this, _NN_trained, true, "f");
    optimizer.alpha = alpha;
    let losses = [],
      accuracies = [],
      l;
    let tempX, tempY;
    for (let i = 0; i < epochs; i++) {
      ({ x, y } = optimizer.process(x, y));
      l = [];
      for (let j = 0; j < x.length; j++) {
        if (x instanceof Array) {
          tempX = x[j];
        }
        if (y instanceof Array) {
          tempY = y[j];
        }
        if (
          x instanceof dataset_1.Dataset ||
          x instanceof dataset_1.DatasetSlice
        ) {
          tempX = x.get(j);
        }
        if (
          y instanceof dataset_1.Dataset ||
          y instanceof dataset_1.DatasetSlice
        ) {
          tempY = y.get(j);
        }
        if (!(tempX instanceof narray_1.default)) {
          throw Error(`Make sure x's elements are of type NArray`);
        }
        if (!(tempY instanceof narray_1.default)) {
          throw Error(`Make sure y's elements are of type NArray`);
        }
        let out = this.forward(tempX);
        l.push(loss(tempY.flatten(), out.flatten()).result);
        optimizer.optimize({
          x: tempX,
          y: tempY,
          layers: __classPrivateFieldGet(this, _NN_layers, "f"),
        });
      }
      losses[i] = errors_1.default.mean(l);
      accuracies[i] = 1 - losses[i];
      if (verbose) {
        console.log(`Epoch: ${i + 1}, accuracy: ${accuracies[i] * 100}`);
      }
    }
    __classPrivateFieldSet(this, _NN_lastOptimizerUsed, optimizer, "f");
    return [losses, accuracies];
  }
  get structure() {
    let structure = ``;
    __classPrivateFieldGet(this, _NN_layers, "f").forEach((e, i) => {
      structure += `Layer ${i + 1}: (${e.inputSize}, ${e.outputSize}), activation function: ${e.activationFunction.toString()} \n`;
    });
    structure = structure.replace("\n$", "");
    return structure;
  }
  explain(x) {
    let explanation = `\n`;
    let recent;
    explanation += `No. of layers: ${__classPrivateFieldGet(this, _NN_layers, "f").length}\n`;
    explanation += `Each layers uses the formula: activationFunction(x*weights + bias)\n`;
    __classPrivateFieldGet(this, _NN_layers, "f").forEach((e, i) => {
      if (i === 0) {
        recent = e.forward(x);
        explanation += `Layer 1 output: ${recent.toString()}\n`;
      } else {
        recent = e.forward(recent);
        explanation += `Layer ${i + 1} output: ${recent.toString()}\n`;
      }
      explanation += `Activation Function Formula: ${e.activationFunction.formula}\n`;
      explanation += `Activation Function Gradient Formula: ${e.activationFunction.gradient}\n\n`;
    });
    if (__classPrivateFieldGet(this, _NN_trained, "f")) {
      explanation += `\n\n----------------- Optimization Steps --------------------\n\n`;
      explanation += __classPrivateFieldGet(this, _NN_lastOptimizerUsed, "f")
        .steps.map((e) => (e.toLowerCase().startsWith("note") ? e : "- " + e))
        .join("\n");
    }
    return explanation;
  }
  save(savePath = "./", force = false) {
    const finalPath = path_1.default.join(savePath, this.name + ".json");
    const contents = {
      weights: [],
      biases: [],
      activationFunctions: [],
      shape: [],
    };
    __classPrivateFieldGet(this, _NN_layers, "f").forEach((e, i) => {
      contents["weights"][i] = e.weights.flatten();
      contents["biases"][i] = e.bias.flatten();
      contents["activationFunctions"][i] = e.activationFunction.toString();
      contents["shape"][i] = e.shape;
    });
    if (fs_1.default.existsSync(finalPath) && !force) {
      throw Error(`File already exists at path ${finalPath}.

      How to fix this?
      Try renaming the file at path ${finalPath}.`);
    }
    fs_1.default.writeFileSync(
      finalPath,
      JSON.stringify(contents, null, 4),
      "utf-8",
    );
  }
  load(filePath) {
    try {
      let data = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8")),
        tempLayer,
        tempActivationFunction,
        tempActivationFunctionName,
        activationFuntionParams;
      for (let i = 0; i < data.weights.length; i++) {
        tempLayer = {
          weights: data.weights[i],
          bias: data.biases[i],
          shape: data.shape[i],
          activationFunction: data.activationFunctions[i],
        };
        __classPrivateFieldGet(this, _NN_layers, "f")[i] = new Layer(
          tempLayer.shape[0],
          tempLayer.shape[1],
        );
        __classPrivateFieldGet(this, _NN_layers, "f")[i].weights =
          new narray_1.default(tempLayer.weights).reshape(
            tempLayer.shape[0],
            tempLayer.shape[1],
          );
        __classPrivateFieldGet(this, _NN_layers, "f")[i].bias =
          new narray_1.default(tempLayer.bias).reshape(1, tempLayer.shape[1]);
        tempActivationFunctionName = tempLayer.activationFunction.replace(
          /([\w\W]*)+\(+([\w\W]*)+\)/gi,
          "$1",
        );
        // check if activation function exists
        tempActivationFunction =
          functions_1.default[tempActivationFunctionName];
        if (!tempActivationFunction) {
          throw Error(
            `Failed to load activation function ${tempLayer.activationFunction} for layer ${i + 1}`,
          );
        }
        if (tempLayer.activationFunction.match(/([\w\W]*)+\(+([\w\W]*)+\)/gi)) {
          activationFuntionParams =
            "[" +
            tempLayer.activationFunction.replace(
              /([\w\W]*)+\(+([\w\W]*)+\)/gi,
              "$2",
            ) +
            "]";
          activationFuntionParams = JSON.parse(
            activationFuntionParams.replace(/\'/g, '"'),
          );
          tempActivationFunctionName =
            tempActivationFunctionName[0].toUpperCase() +
            tempActivationFunctionName.slice(1);
          tempActivationFunction = new functions_1.default[
            tempActivationFunctionName
          ](...activationFuntionParams);
          __classPrivateFieldGet(this, _NN_layers, "f")[i].activationFunction =
            tempActivationFunction;
        } else {
          __classPrivateFieldGet(this, _NN_layers, "f")[i].activationFunction =
            tempActivationFunction;
        }
      }
    } catch (e) {
      throw Error(`Failed to load model.

      Error: ${e}`);
    }
  }
}
exports.NN = NN;
(_NN_layers = new WeakMap()),
  (_NN_name = new WeakMap()),
  (_NN_trained = new WeakMap()),
  (_NN_lastOptimizerUsed = new WeakMap());
class Layer {
  /**
   * Single layer in the neural network
   *
   * @param inputSize: int
   * @param outputSize: int
   */
  constructor(inputSize, outputSize) {
    _Layer_instances.add(this);
    _Layer_weights.set(this, undefined);
    _Layer_bias.set(this, undefined);
    this.inputSize = 0;
    this.outputSize = 0;
    _Layer_activationFunction.set(this, undefined);
    this.name = undefined;
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    nLayer++;
    __classPrivateFieldSet(
      this,
      _Layer_weights,
      __classPrivateFieldGet(
        this,
        _Layer_instances,
        "m",
        _Layer_generateWeights,
      ).call(this, inputSize, outputSize),
      "f",
    );
    __classPrivateFieldSet(
      this,
      _Layer_bias,
      __classPrivateFieldGet(
        this,
        _Layer_instances,
        "m",
        _Layer_generateWeights,
      ).call(this, 1, outputSize),
      "f",
    );
  }
  get weights() {
    return __classPrivateFieldGet(this, _Layer_weights, "f");
  }
  get bias() {
    return __classPrivateFieldGet(this, _Layer_bias, "f");
  }
  set weights(newWeights) {
    if (!(newWeights instanceof narray_1.default)) {
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
    __classPrivateFieldSet(this, _Layer_weights, newWeights, "f");
  }
  set bias(newBias) {
    if (!(newBias instanceof narray_1.default)) {
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
    __classPrivateFieldSet(this, _Layer_bias, newBias, "f");
  }
  forward(x) {
    if (!(x instanceof narray_1.default) && x instanceof Array) {
      x = new narray_1.default(x);
    } else if (!(x instanceof narray_1.default)) {
      throw Error(`Invalid input for layer ${this.name || nLayer}

      Make sure x is of type NArray`);
    }
    if (x.length !== this.inputSize) {
      throw Error(`${x.length}(no. of elems) != ${this.inputSize}(inputSize)

      How to fix this?
      Make sure the length of x(${x.length}) = ${this.inputSize}`);
    }
    let z1 = x.dot(this.weights);
    z1 = z1.add(this.bias);
    if (
      __classPrivateFieldGet(this, _Layer_activationFunction, "f") instanceof
      functions_1.ActivationFunction
    ) {
      z1 = __classPrivateFieldGet(
        this,
        _Layer_activationFunction,
        "f",
      ).calculate(z1);
    } else {
      throw Error(`Failed to compute output from ActivationFunction.

      How to fix this?
      Make sure you are setting the activation function for layer ${this.name}`);
    }
    if (!(z1 instanceof narray_1.default)) {
      throw Error(`Invalid result for layer ${this.name}.

      What does this mean?
      While trying to compute result for Layer ${this.name} a number is returned rather than an NArray

      How can you fix it?
      Try raising an issue if you see this error along with the code for neural network and your training dataset on https://github.com/pratyushtiwary/toynn`);
    }
    z1 = z1.reshape(1, this.outputSize);
    return z1;
  }
  get shape() {
    return [this.inputSize, this.outputSize];
  }
  set activationFunction(func) {
    if (!(func instanceof functions_1.ActivationFunction)) {
      throw Error(`Invalid activation function.

      How to fix this?
      Make sure you've passed object of type ActivationFunction`);
    }
    __classPrivateFieldSet(this, _Layer_activationFunction, func, "f");
  }
  use(obj) {
    this.activationFunction = obj;
  }
  get activationFunction() {
    return __classPrivateFieldGet(this, _Layer_activationFunction, "f");
  }
}
exports.Layer = Layer;
(_Layer_weights = new WeakMap()),
  (_Layer_bias = new WeakMap()),
  (_Layer_activationFunction = new WeakMap()),
  (_Layer_instances = new WeakSet()),
  (_Layer_generateWeights = function _Layer_generateWeights(x, y) {
    let tempWeights = [];
    for (let i = 0; i < x * y; i++) {
      tempWeights[i] = narray_1.default.randn();
    }
    return new narray_1.default(tempWeights).reshape(x, y);
  });
exports.default = { NN, Layer };
