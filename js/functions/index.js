"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same.`);
    }
    get gradient() {
        throw Error(`Gradient for the activation function is not defined.
    
    How to fix this?
    If you are the developer of this activation function, try overwritting the gradient getter with the gradient formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same.`);
    }
    calcGradient(x) {
        throw Error(`Gradient Calculation for the activation function is not defined.
    
    How to fix this?
    If you are the developer of this activation function, try overwritting the calcGradient function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same.`);
    }
    calculate(x) {
        throw Error(`Calculation for the activation function is not defined.
    
    How to fix this?
    If you are the developer of this activation function, try overwritting the calculate function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same.`);
    }
    toString() {
        throw Error(`Name for the activation function is not defined.
    
    How to fix this?
    If you are the developer of this activation function, try overwritting the toString function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same.`);
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
        return "<Sigmoid(x)>";
    }
}
class ReLU extends ActivationFunction {
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
        return "<ReLU(x)>";
    }
}
class LeakyReLU extends ActivationFunction {
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
        return "<ReLU(x)>";
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
        return "<Softmax(x)>";
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
        return "<Tanh(x)>";
    }
}
const functions = {
    sigmoid: new Sigmoid(),
    relu: new ReLU(),
    leakyRelu: new LeakyReLU(),
    softmax: new Softmax(),
    tanh: new Tanh(),
};
exports.default = Object.assign(Object.assign({}, functions), { ActivationFunction });
//# sourceMappingURL=index.js.map