export type StatErrorInput = Array<number>;

export interface StatErrorReturn {
  apply: Function;
  result: number | Array<number>;
  formula: String;
}

export class StatError {
  #yTrue: Array<number> = undefined;
  #yPred: Array<number> = undefined;
  result: Array<number> | number = undefined;
  formula: String = undefined;

  constructor(yTrue: StatErrorInput, yPred: StatErrorInput) {
    if (yTrue.length !== yPred.length) {
      throw Error(
        `Array length mismatch, make sure yTrue.length == yPred.length

        How to fix this?
        Make sure that the passed yTrue Array and yPred Array are of the same size.
        If you are using NArray try reshaping them.`,
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
  apply(func: Function): StatErrorReturn {
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
  use(func: Function = undefined): StatErrorReturn {
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

function mean(x: Array<number>): number {
  return sum(x) / x.length;
}

function sum(x: Array<number>): number {
  return x.reduce((a, b) => a + b);
}

function square(x: number): number {
  return x * x;
}

function MAE(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
  return new StatError(yTrue, yPred).use(Math.abs).apply(mean);
}

function MSE(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
  return new StatError(yTrue, yPred).use(square).apply(mean);
}

function RMSE(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
  return MSE(yTrue, yPred).apply(Math.sqrt);
}

function RSS(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
  return new StatError(yTrue, yPred).use(square).apply(sum);
}

function error(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
  return new StatError(yTrue, yPred).use();
}

export default {
  StatError,
  error,
  MAE,
  MSE,
  RMSE,
  RSS,
  mean,
  sum,
  square,
};
