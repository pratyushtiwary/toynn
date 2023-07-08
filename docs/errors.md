# Errors

This package contains statistical error functions.

**Currently there are no functions or classes to get error regarding classifiers**

## Usage

```js
// imports

let yTrue = [1, 2, 3, 4, 5];
let yPred = [1.1, 1.99, 3, 4.05, 5];

console.log(errors.RSS(yTrue, yPred).result); // 0.0126
console.log(errors.RSS(yTrue, yPred).formula); // sum(square(yTrue - yPred))
```

## StatError Class

You can use `StatError` class to create a custom error.

**Note: While creating custom error try not to use anonymous functions**

## Implemented Errors

Following are the error functions alreay implemented :

- error: Returns list of difference between yTrue and yPred respective values,
- RSS,
- MAE,
- MSE,
- RMSE

## Extra Functions

These functions are used while implementing errors. They are made available to export cause they are used often.

Following are the extra functions implemented :

- mean,
- sum,
- square
