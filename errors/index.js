"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it",
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
          ? (f.value = value)
          : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it",
      );
    return kind === "m"
      ? f
      : kind === "a"
        ? f.call(receiver)
        : f
          ? f.value
          : state.get(receiver);
  };
var _StatError_yTrue, _StatError_yPred;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatError = void 0;
class StatError {
  constructor(yTrue, yPred) {
    _StatError_yTrue.set(this, undefined);
    _StatError_yPred.set(this, undefined);
    this.result = undefined;
    this.formula = undefined;
    if (yTrue.length !== yPred.length) {
      throw Error(`Array length mismatch, make sure yTrue.length == yPred.length

        How to fix this?
        Make sure that the passed yTrue Array and yPred Array are of the same size.
        If you are using NArray try reshaping them.`);
    }
    __classPrivateFieldSet(this, _StatError_yTrue, yTrue, "f");
    __classPrivateFieldSet(this, _StatError_yPred, yPred, "f");
  }
  /**
   * Takes in a function and use it to compute result value
   *
   * Can be chained
   */
  apply(func) {
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
  use(func = undefined) {
    this.result = [];
    let temp;
    __classPrivateFieldGet(this, _StatError_yTrue, "f").forEach((e, i) => {
      temp = e - __classPrivateFieldGet(this, _StatError_yPred, "f")[i];
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
exports.StatError = StatError;
(_StatError_yTrue = new WeakMap()), (_StatError_yPred = new WeakMap());
function mean(x) {
  return sum(x) / x.length;
}
function sum(x) {
  return x.reduce((a, b) => a + b);
}
function square(x) {
  return x * x;
}
function MAE(yTrue, yPred) {
  return new StatError(yTrue, yPred).use(Math.abs).apply(mean);
}
function MSE(yTrue, yPred) {
  return new StatError(yTrue, yPred).use(square).apply(mean);
}
function RMSE(yTrue, yPred) {
  return MSE(yTrue, yPred).apply(Math.sqrt);
}
function RSS(yTrue, yPred) {
  return new StatError(yTrue, yPred).use(square).apply(sum);
}
function error(yTrue, yPred) {
  return new StatError(yTrue, yPred).use();
}
exports.default = {
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
