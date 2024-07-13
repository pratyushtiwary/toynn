import StatError from "./base";
import type { StatErrorInput, StatErrorReturn } from "./types";

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
  error,
  MAE,
  MSE,
  RMSE,
  RSS,
  mean,
  sum,
  square,
};
