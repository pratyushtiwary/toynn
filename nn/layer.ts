import NArray from '@/narray';
import { ActivationFunction } from '@/functions';

import type { ActivationFunctionType } from '@/functions/types';
import type { Element } from '@/narray/types';

let nLayer = 0;

export default class Layer {
    #weights: NArray = undefined;
    #bias: NArray = undefined;
    inputSize: number = 0;
    outputSize: number = 0;
    #activationFunction: ActivationFunction = undefined;
    name: string = undefined;

    /**
     * Single layer in the neural network
     *
     * @param inputSize: int
     * @param outputSize: int
     */
    constructor(inputSize: number, outputSize: number) {
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        nLayer++;

        this.#weights = this.#generateWeights(inputSize, outputSize);
        this.#bias = this.#generateWeights(1, outputSize);
    }

    #generateWeights(x: number, y: number): NArray {
        const tempWeights = [];

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

    forward(x: Array<Element> | NArray): NArray {
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
        z1 = z1.add(this.bias);
        if (this.#activationFunction instanceof ActivationFunction) {
            z1 = this.#activationFunction.calculate(z1);
        } else {
            throw Error(`Failed to compute output from ActivationFunction.

      How to fix this?
      Make sure you are setting the activation function for layer ${this.name}`);
        }
        if (!(z1 instanceof NArray)) {
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
