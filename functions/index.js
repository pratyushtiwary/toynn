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
var _Linear_a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationFunction = void 0;
const narray_1 = __importDefault(require("../narray"));
class ActivationFunction {
    /**
     * Made to act as a base class for activation functions
     *
     * Reference: https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/
     */
    get formula() {
        throw Error(`Formula for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the formula getter with the formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
    get gradient() {
        throw Error(`Gradient for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the gradient getter with the gradient formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
    calcGradient(x) {
        throw Error(`Gradient Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calcGradient function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
    calculate(x) {
        throw Error(`Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calculate function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
    toString() {
        throw Error(`Name for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the toString function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
}
exports.ActivationFunction = ActivationFunction;
class Sigmoid extends ActivationFunction {
    get formula() {
        return "1/(1+e^-x)";
    }
    get gradient() {
        return "sigmoid(x)*(1-sigmoid(x))";
    }
    calcGradient(x) {
        // multiplied by -1 cause it's 1-sigmoid(x)
        return x.mul(x.sub(1).mul(-1));
    }
    calculate(x) {
        let result = x.map((e) => 1 / (1 + Math.pow(Math.E, -e)));
        return new narray_1.default(result);
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
    calcGradient(x) {
        return x.map((e) => (e >= 0 ? 1 : 0));
    }
    calculate(x) {
        let result = x.map((e) => Math.max(0, e));
        return new narray_1.default(result);
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
    calcGradient(x) {
        return x.map((e) => (e >= 0 ? 1 : 0.01));
    }
    calculate(x) {
        let result = x.map((e) => Math.max(0.01 * e, e));
        return new narray_1.default(result);
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
    calcGradient(x) {
        /**
         * Reference: https://github.com/2015xli/multilayer-perceptron/blob/master/multilayer-perceptron-batch.ipynb
         */
        return x.diag().sub(x.T.dot(x)).sum(0);
    }
    calculate(x) {
        const eulerNo = Math.E;
        let summEx = x.map((e) => Math.pow(eulerNo, e)).reduce((a, b) => a + b);
        if (summEx === Infinity) {
            console.warn(`Softmax Activation Function results might come in NaN or Infinity, try using different activation function.

        What does this means?
        Some the passed values are very large which results exponential sum of them to reach infinity.

        How can i fix this?
        Either scale down the values or try different activation function`);
        }
        let result = x.map((e) => Math.pow(eulerNo, e) / summEx);
        return new narray_1.default(result);
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
    calcGradient(x) {
        // multiplied by -1 cause it's 1 - tanh^2(x)
        return x.pow(2).sub(1).mul(-1);
    }
    calculate(x) {
        let result = x.map((e) => 2 / (1 + Math.pow(Math.E, -2 * e)) - 1);
        return new narray_1.default(result);
    }
    toString() {
        return "tanh";
    }
}
class Linear extends ActivationFunction {
    constructor(a = 1) {
        super();
        _Linear_a.set(this, undefined);
        __classPrivateFieldSet(this, _Linear_a, a, "f");
    }
    get formula() {
        return "a*x";
    }
    get gradient() {
        return "a";
    }
    calcGradient(x) {
        return x.map(() => __classPrivateFieldGet(this, _Linear_a, "f"));
    }
    calculate(x) {
        let result = x.map((e) => e * __classPrivateFieldGet(this, _Linear_a, "f"));
        return new narray_1.default(result);
    }
    toString() {
        return `linear(${__classPrivateFieldGet(this, _Linear_a, "f")})`;
    }
}
_Linear_a = new WeakMap();
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
exports.default = Object.assign(Object.assign({}, functions), { ActivationFunction });
