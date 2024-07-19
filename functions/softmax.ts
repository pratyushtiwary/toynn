import ActivationFunction from './base';
import NArray from '@/narray';

import type {
    ActivationFunctionResult,
    ActivationFunctionInput,
} from './types';

export default class Softmax extends ActivationFunction {
    get formula() {
        return 'exp(xi)/sum(exp(x))';
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
        const summEx = x
            .map((e) => Math.pow(eulerNo, e))
            .reduce((a, b) => a + b);
        if (summEx === Infinity) {
            console.warn(
                `Softmax Activation Function results might come in NaN or Infinity, try using different activation function.

        What does this means?
        Some the passed values are very large which results exponential sum of them to reach infinity.

        How can i fix this?
        Either scale down the values or try different activation function`
            );
        }
        const result = x.map((e) => Math.pow(eulerNo, e) / summEx);

        return new NArray(result);
    }

    toString() {
        return 'softmax';
    }
}
