"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _NN_instances, _NN_layers, _NN_name, _NN_backprop, _Layer_instances, _Layer_weights, _Layer_bias, _Layer_activationFunction, _Layer_generateWeights;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.NN = void 0;
const errors_1 = __importDefault(require("../errors"));
const functions_1 = require("../functions");
const optimizers_1 = require("../optimizers");
const narray_1 = __importDefault(require("../narray"));
let nLayer = 0;
class NN {
    constructor(name) {
        _NN_instances.add(this);
        _NN_layers.set(this, []);
        _NN_name.set(this, undefined);
        /**
         * Takes in a name and allows users to create a skeleton which holds layer and activation function
         * Object of this class also allows user to backpropogate and predict
         *
         * @param name: str -> Name of the model. This name will later be used to load and save model
         *
         * Reference: https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
         */
        __classPrivateFieldSet(this, _NN_name, name, "f");
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
                const [_, prevOutputSize] = (_a = __classPrivateFieldGet(this, _NN_layers, "f")[__classPrivateFieldGet(this, _NN_layers, "f").length - 1]) === null || _a === void 0 ? void 0 : _a.shape;
                if (inputSize !== prevOutputSize) {
                    throw Error(`Layer's input size doesn't match with previous layer's output size! Make sure the output of previous layer is equal to the input of this layer
            
            How to fix this?
            Make sure that layer ${__classPrivateFieldGet(this, _NN_layers, "f").length + 1}'s input size = ${prevOutputSize}`);
                }
            }
            __classPrivateFieldGet(this, _NN_layers, "f").push(obj);
        }
        else {
            throw Error(`Unable to add the passed object to the model's pipeline.
      
      How to fix this?
      The object you passed to is not a Layer, try to pass Layer's object`);
        }
    }
    forward(x) {
        if (!(x instanceof narray_1.default) && x instanceof Array) {
            x = new narray_1.default(x);
        }
        else if (!(x instanceof narray_1.default)) {
            throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your x to NArray`);
        }
        let recent;
        __classPrivateFieldGet(this, _NN_layers, "f").forEach((e, i) => {
            if (i === 0) {
                recent = e.forward(x);
            }
            else {
                recent = e.forward(recent);
            }
        });
        return recent;
    }
    train({ x, y, epochs, alpha = 0.001, verbose = false, loss = errors_1.default.RSS, optimizer = new optimizers_1.GradientDescent(), }) {
        optimizer.alpha = alpha;
        let losses = [], accuracies = [], l;
        for (let i = 0; i < epochs; i++) {
            ({ x, y } = optimizer.process(x, y));
            l = [];
            for (let j = 0; j < x.length; j++) {
                if (!(x[j] instanceof narray_1.default)) {
                    throw Error(`Make sure x's elements both are of type NArray`);
                }
                let out = this.forward(x[j]);
                if (!(y[j] instanceof narray_1.default)) {
                    throw Error(`Make sure y's elements are of type NArray`);
                }
                l.push(loss(y[j].flatten(), out.flatten()).result);
                __classPrivateFieldGet(this, _NN_instances, "m", _NN_backprop).call(this, {
                    x: x[j],
                    y: y[j],
                    alpha,
                    optimizer,
                });
            }
            losses[i] = errors_1.default.mean(l);
            accuracies[i] = 1 - losses[i];
            if (verbose) {
                console.log(`Epoch: ${i + 1}, accuracy: ${accuracies[i] * 100}`);
            }
        }
        return [losses, accuracies];
    }
}
exports.NN = NN;
_NN_layers = new WeakMap(), _NN_name = new WeakMap(), _NN_instances = new WeakSet(), _NN_backprop = function _NN_backprop({ x, y, alpha = 0.001, optimizer = new optimizers_1.GradientDescent(), }) {
    optimizer.alpha = alpha;
    if (!(x instanceof narray_1.default) && x instanceof Array) {
        x = new narray_1.default(x);
    }
    else if (!(x instanceof narray_1.default)) {
        throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your x to NArray`);
    }
    if (!(y instanceof narray_1.default) && y instanceof Array) {
        y = new narray_1.default(y);
    }
    else if (!(y instanceof narray_1.default)) {
        throw Error(`Invalid input for model ${this.name}
      
      How to fix this?
      Convert your y to NArray`);
    }
    optimizer.optimize({
        x,
        y,
        layers: __classPrivateFieldGet(this, _NN_layers, "f"),
    });
};
class Layer {
    constructor(inputSize, outputSize) {
        _Layer_instances.add(this);
        _Layer_weights.set(this, undefined);
        _Layer_bias.set(this, undefined);
        this.inputSize = 0;
        this.outputSize = 0;
        _Layer_activationFunction.set(this, undefined);
        this.name = undefined;
        /**
         * Single layer in the neural network
         *
         * @param inputSize: int
         * @param outputSize: int
         */
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        nLayer++;
        __classPrivateFieldSet(this, _Layer_weights, __classPrivateFieldGet(this, _Layer_instances, "m", _Layer_generateWeights).call(this, inputSize, outputSize), "f");
        __classPrivateFieldSet(this, _Layer_bias, __classPrivateFieldGet(this, _Layer_instances, "m", _Layer_generateWeights).call(this, 1, outputSize), "f");
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
        }
        else if (!(x instanceof narray_1.default)) {
            throw Error(`Invalid input for layer ${this.name || nLayer}
      
      Make sure x is of type NArray`);
        }
        if (x.length !== this.inputSize) {
            throw Error(`${x.length}(no. of elems) != ${this.inputSize}(inputSize)
      
      How to fix this?
      Make sure the length of x(${x.length}) = ${this.inputSize}`);
        }
        let z1 = x.dot(this.weights);
        if (!(z1 instanceof narray_1.default)) {
            throw Error(`Invalid result for layer ${this.name}.
      
      What does this mean?
      While trying to compute result for Layer ${this.name} a number is returned rather than an NArray
      
      How can you fix it?
      Try raising an issue if you see this error along with the code for neural network and your training dataset`);
        }
        z1 = z1.add(this.bias);
        let a1 = __classPrivateFieldGet(this, _Layer_activationFunction, "f").calculate(z1).reshape(1, this.outputSize);
        return a1;
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
_Layer_weights = new WeakMap(), _Layer_bias = new WeakMap(), _Layer_activationFunction = new WeakMap(), _Layer_instances = new WeakSet(), _Layer_generateWeights = function _Layer_generateWeights(x, y) {
    let tempWeights = [];
    for (let i = 0; i < x * y; i++) {
        tempWeights[i] = narray_1.default.randn();
    }
    return new narray_1.default(tempWeights).reshape(x, y);
};
exports.default = { NN, Layer };
//# sourceMappingURL=index.js.map