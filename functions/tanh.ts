import ActivationFunction from "./base";
import NArray from "@/narray";

import type {
  ActivationFunctionResult,
  ActivationFunctionInput,
} from "./types";

export default class Tanh extends ActivationFunction {
  get formula() {
    return "2 * sigmoid(2x) - 1";
  }

  get gradient() {
    return "1 - tanh^2(x)";
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    // multiplied by -1 cause it's 1 - tanh^2(x)
    return x.pow(2).sub(1).mul(-1);
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e) => 2 / (1 + Math.pow(Math.E, -2 * e)) - 1);

    return new NArray(result);
  }

  toString() {
    return "tanh";
  }
}
