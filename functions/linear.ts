import ActivationFunction from "./base";
import NArray from "@/narray";

import type {
  ActivationFunctionResult,
  ActivationFunctionInput,
} from "./types";

export default class Linear extends ActivationFunction {
  #a = undefined;

  constructor(a = 1) {
    super();
    this.#a = a;
  }

  get formula() {
    return "a*x";
  }

  get gradient() {
    return "a";
  }

  calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
    return x.map(() => this.#a);
  }

  calculate(x: ActivationFunctionInput): ActivationFunctionResult {
    const result = x.map((e: number) => e * this.#a);

    return new NArray(result);
  }

  toString() {
    return `linear(${this.#a})`;
  }
}
