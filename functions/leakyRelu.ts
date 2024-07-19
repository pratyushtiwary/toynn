import ActivationFunction from './base';
import NArray from '@/narray';

import type {
    ActivationFunctionResult,
    ActivationFunctionInput,
} from './types';

export default class LeakyRelu extends ActivationFunction {
    get formula() {
        return `x, x>=0, 0.01x, x<0`;
    }

    get gradient() {
        return `1, x>0, 0.01, x<=0`;
    }

    calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
        return x.map((e: number) => (e >= 0 ? 1 : 0.01));
    }

    calculate(x: ActivationFunctionInput): ActivationFunctionResult {
        const result = x.map((e: number) => Math.max(0.01 * e, e));

        return new NArray(result);
    }

    toString() {
        return 'leakyRelu';
    }
}
