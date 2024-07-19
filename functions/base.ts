import type {
    ActivationFunctionResult,
    ActivationFunctionInput,
} from './types';

export default class ActivationFunction {
    /**
     * Made to act as a base class for activation functions
     *
     * Reference: https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/
     */

    get formula(): string {
        throw Error(`Formula for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the formula getter with the formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }

    get gradient(): string {
        throw Error(`Gradient for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the gradient getter with the gradient formula.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
        throw Error(`Gradient Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calcGradient function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    calculate(x: ActivationFunctionInput): ActivationFunctionResult {
        throw Error(`Calculation for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the calculate function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }

    toString(): string {
        throw Error(`Name for the activation function is not defined.

    How to fix this?
    If you are the developer of this activation function, try overwritting the toString function.
    If you are not the developer of this activation function, try using other activations functions, also try to raise an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
}
