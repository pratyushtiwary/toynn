import ActivationFunction from "./base";
import NArray from "@/narray";

import type {
  ActivationFunctionResult,
  ActivationFunctionInput,
} from "./types";

export default class Relu extends ActivationFunction {
  get formula() {
    return `x, x>=0, 0, x<0`;
  }

  get gradient() {
    return `1, x>0, 0, x<=0`;
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    return x.map((e: number) => (e >= 0 ? 1 : 0));
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => Math.max(0, e));

    return new NArray(result);
  }

  toString() {
    return "relu";
  }
}
