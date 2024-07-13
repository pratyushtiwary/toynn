import type {
  StatErrorInput,
  StatErrorApplyFunction,
  StatErrorReturn,
  StatErrorUseFunction,
} from "./types";

export default class StatError {
  #yTrue: StatErrorInput = undefined;
  #yPred: StatErrorInput = undefined;
  result: StatErrorReturn["result"] = undefined;
  formula: string = undefined;

  constructor(yTrue: StatErrorInput, yPred: StatErrorInput) {
    if (yTrue.length !== yPred.length) {
      throw Error(
        `Array length mismatch, make sure yTrue.length == yPred.length

        How to fix this?
        Make sure that the passed yTrue Array and yPred Array are of the same size.
        If you are using NArray try reshaping them.`
      );
    }
    this.#yTrue = yTrue;
    this.#yPred = yPred;
  }

  /**
   * Takes in a function and use it to compute result value
   *
   * Can be chained
   */
  apply(func: StatErrorApplyFunction): StatErrorReturn {
    this.result = func(this.result);
    if (func.name === "") {
      throw Error("Anonymous functions are not supported");
    }
    this.formula = `${func.name}(${this.formula})`;

    return {
      result: this.result,
      apply: this.apply,
      formula: this.formula,
    };
  }

  /**
   * Takes in a function and use it to transform loss value for each row
   *
   * Can't be chanined
   */
  use(func: StatErrorUseFunction = undefined): StatErrorReturn {
    this.result = [];
    let temp: number;
    this.#yTrue.forEach((e, i) => {
      temp = e - this.#yPred[i];
      if (func) {
        temp = func(temp);
      }
      if (this.result instanceof Array) {
        this.result.push(temp);
      }
    });

    this.formula = "yTrue - yPred";
    if (func) {
      if (func.name === "") {
        throw Error("Anonymous functions are not supported");
      }
      this.formula = `${func.name}(${this.formula})`;
    }

    return {
      result: this.result,
      apply: this.apply,
      formula: this.formula,
    };
  }
}
