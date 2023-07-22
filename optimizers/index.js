"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StochasticGradientDescent = exports.GradientDescent = exports.Optimizer = void 0;
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
class GradientDescent extends Optimizer {
    constructor({ momentum = 0.9 }) {
        super();
        /**
         *
         * References:
         *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
         *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
         *  - https://stackoverflow.com/a/13342725
         */
        this.firstRun = true;
        this.weightsHistory = [];
        this.biasHistory = [];
        if (momentum > 1 || momentum < 0) {
            throw Error(`Value for momentum should be between 0 and 1.`);
        }
        this.momentum = momentum;
    }
    _optimize({ x, y, layers }) {
        let layersOp = [], // keeps track of each layer's output
        recent, weightGradients = [], biasGradients = [], weightErrors = [], // keeps track of weights errors
        adjustedWeights = [], // keeps track of new weights
        adjustedBiases = [];
        layers.forEach((e, i) => {
            if (i === 0) {
                recent = e.forward(x);
            }
            else {
                recent = e.forward(recent);
            }
            layersOp.push(recent);
        });
        weightGradients[layersOp.length - 1] = layersOp[layersOp.length - 1].sub(y);
        biasGradients[layersOp.length - 1] = layers[layersOp.length - 1].activationFunction.calcGradient(layersOp[layersOp.length - 1].sub(y));
        // calculate errors and gradient for weight and gradient for bias
        for (let i = layers.length - 2; i >= 0; i--) {
            weightErrors[i] = layers[i + 1].weights.dot(weightGradients[i + 1].T);
            weightGradients[i] = weightErrors[i].T.mul(layers[i].activationFunction.calcGradient(layersOp[i]));
            biasGradients[i] = layers[i].activationFunction.calcGradient(layersOp[i]);
        }
        if (this.weightsHistory.length === 0 && this.biasHistory.length === 0) {
            for (let i = 0; i < layers.length; i++) {
                this.weightsHistory.push(narray_1.default.zeroes(...layers[i].shape));
                this.biasHistory.push(narray_1.default.zeroes(1, layers[i].shape[1]));
            }
            this.firstRun = false;
        }
        for (let i = 0; i < layers.length; i++) {
            if (i === 0) {
                weightGradients[0] = x.T.dot(weightGradients[0]);
            }
            else {
                weightGradients[i] = layersOp[i - 1].T.dot(weightGradients[i]);
            }
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
            "Perform the above step iteratively for each layer, replace last layer by n layer and second last layer by n - 1 layer",
            "Now that we have each layer's error, iteratively multiply the error's transpose with gradient of that layer's output",
            "Now once we have the gradient, multiply the gradient with the x's transpose provided by you for the 1st layer",
            "For 2nd layer till n layer multiply previous layer output's transpose by that layer's gradient",
            "Now again iterate through layers and subtract the previous step's output by the weights of the respective layer after multiplying by alpha",
            "For bias, simply find the gradient of each layer's output",
            "Then subtract that result from that layer's bias after multiplying by alpha",
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
            throw Error(`SGD: Failed to shuffle data. utils.shuffle returned unexpected value.`);
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
exports.default = {
    Optimizer,
    GradientDescent,
    StochasticGradientDescent,
    GD: GradientDescent,
    SGD: StochasticGradientDescent,
};
//# sourceMappingURL=index.js.map