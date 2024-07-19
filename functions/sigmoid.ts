import ActivationFunction from './base';
import NArray from '@/narray';

import type {
    ActivationFunctionResult,
    ActivationFunctionInput,
} from './types';

export default class Sigmoid extends ActivationFunction {
    get formula() {
        return '1/(1+e^-x)';
    }

    get gradient() {
        return 'sigmoid(x)*(1-sigmoid(x))';
    }

    calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
        // multiplied by -1 cause it's 1-sigmoid(x)
        return x.mul(x.sub(1).mul(-1));
    }

    calculate(x: ActivationFunctionInput): ActivationFunctionResult {
        const result = x.map((e: number) => 1 / (1 + Math.pow(Math.E, -e)));

        return new NArray(result);
    }

    toString() {
        return 'sigmoid';
    }
}
