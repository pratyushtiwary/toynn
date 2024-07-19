---
title: Intro to Errors
description: A guide to how you can use Errors
sidebar:
    order: 1
---

Errors contains statistical error functions.

**Currently there are no functions or classes to get error regarding classifiers**

## Usage

```js
import toynn from 'toynn';

let yTrue = [1, 2, 3, 4, 5];
let yPred = [1.1, 1.99, 3, 4.05, 5];

console.log(toynn.errors.RSS(yTrue, yPred).result); // 0.0126
console.log(toynn.errors.RSS(yTrue, yPred).formula); // sum(square(yTrue - yPred))
```

## Premade Errors

Errors comes with a lot of error functions already implemented. Following are the functions that comes pre loaded with Errors:

1. error :- Returns a list of y^ - y,
2. MAE,
3. MSE,
4. RSS,
5. RSME

## Custom Error

You can use StatError class to create a custom error.

**Note: While creating custom error do not use anonymous functions**

You can use StatError class's object to create a custom error.

-   use(func: Function): StatErrorReturn : Takes in a function and use it to transform loss value for each row. Can't be chained,

-   apply(func: Function): StatErrorReturn : Takes in a function and use it to compute result value. Can be chained.

**Note: You should always pass a named function inside use and apply or else they'll throw Error**

### Example

The RSS error function is implemented as follows:

```ts
function RSS(yTrue: StatErrorInput, yPred: StatErrorInput): StatErrorReturn {
    return new StatError(yTrue, yPred).use(square).apply(sum);
}
```

## Extra Funtions

Errors comes with 3 more extra functions

1. mean,
2. sum,
3. square

You can use these instead of creating one from scratch.
