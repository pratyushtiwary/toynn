"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradientDescent = exports.Optimizer = void 0;
class Optimizer {
    constructor(alpha = 0.01) {
        this._alpha = undefined;
        this._alpha = alpha;
    }
    process(x, y) {
        return { x, y };
    }
    optimize({ x, y, layers }) {
        throw Error(`Method not implemented!
    
    How can you fix this?
    Try overloading the optimize method.`);
    }
}
exports.Optimizer = Optimizer;
class GradientDescent extends Optimizer {
    /**
     *
     * References:
     *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
     *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
     *  - https://stackoverflow.com/a/13342725
     */
    optimize({ x, y, layers }) {
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
        weightErrors[layersOp.length - 1] = layersOp[layersOp.length - 1].sub(y);
        biasGradients[layersOp.length - 1] = layers[layersOp.length - 1].activationFunction.calcGradient(layersOp[layersOp.length - 1].sub(y));
        // calculate errors for weight and gradient for bias
        for (let i = layers.length - 2; i >= 0; i--) {
            weightErrors[i] = layers[i + 1].weights.dot(weightErrors[i + 1].T);
            weightErrors[i] = weightErrors[i].T.mul(layers[i].activationFunction.calcGradient(layersOp[i]));
            biasGradients[i] = layers[i].activationFunction.calcGradient(layersOp[i]);
        }
        // calculate gradients for weights
        for (let i = 0; i < layers.length; i++) {
            if (i === 0) {
                weightGradients[0] = x.T.dot(weightErrors[0]);
            }
            else {
                weightGradients[i] = layersOp[i - 1].T.dot(weightErrors[i]);
            }
        }
        // calculate new adjusted weights and biases
        for (let i = 0; i < layers.length; i++) {
            adjustedWeights[i] = layers[i].weights.sub(weightGradients[i].mul(this._alpha));
            adjustedBiases[i] = layers[i].bias.sub(biasGradients[i].mul(this._alpha));
        }
        // console.log(adjustedWeights[0].real, adjustedBiases[0].real);
        // update these new weights and biases
        for (let i = 0; i < layers.length; i++) {
            layers[i].weights = adjustedWeights[i];
            layers[i].bias = adjustedBiases[i];
        }
    }
}
exports.GradientDescent = GradientDescent;
exports.default = {
    Optimizer,
    GradientDescent,
};
//# sourceMappingURL=index.js.map