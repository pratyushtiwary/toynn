---
title: Intro to Functions
description: A guide to how you can use Functions
sidebar:
    order: 1
---

Functions contains Activation Functions which can be passed to Layer.

## Available Activation Functions

-   Sigmoid,
-   ReLU,
-   LeakyReLU,
-   Softmax,
-   Tanh,
-   Linear

You can use formula and gradient getter to get the respective values.

### Getting Function formula

```js
import toynn from 'toynn';

console.log(toynn.functions.linear.formula); // a*x
```

### Getting Function gradient formula

```js
import toynn from 'toynn';

console.log(toynn.functions.linear.gradient); // a*x
```

### Calculate Result

```js
import toynn from 'toynn';

console.log(toynn.functions.linear.calculate([1, 2, 3, 4])); // NArray{}
```

### Calculate Gradient

```js
import toynn from 'toynn';

const result = toynn.functions.linear.calculate([1, 2, 3, 4]); // NArray{}

console.log(toynn.functions.linear.calcGradient(result)); // NArray{}
```

## Custom Function

You can create your custom activation functions by creating a new class and extending the ActivationFunction class.

Your activation function should have the following attributes and functions :

### get formula

This should return your activation function's formula,

### get gradient

This should return your activation function's gradient formula,

### calcGradient

```
Signature: calcGradient(x: NArray): NArray
```

It should return the gradient for the provided x

### calculate

```
Signature: calcGradient(x: Array): NArray
```

It should return the values of x for your activation function

### toString

```
Signature: toString(): string
```

Return string version of how the object should be intialized.

**This is used while saving and loading the model**

### Example

```ts
class Linear extends ActivationFunction {
    #a = undefined;

    constructor(a = 1) {
        super();
        this.#a = a;
    }

    get formula() {
        return 'a*x';
    }

    get gradient() {
        return 'a';
    }

    calcGradient(x: ActivationFunctionResult): ActivationFunctionResult {
        return x.map(() => this.#a);
    }

    calculate(x: ActivationFunctionInput): ActivationFunctionResult {
        let result = x.map((e: number) => e * this.#a);

        return new NArray(result);
    }

    toString() {
        return `linear(${this.#a})`;
    }
}
```

## References

Some of the functionality is implemented using the awesome resources from the internet.

-   ✨ [Most of the activation function's formula and gradient is taken from here](https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/),
-   ✨ [Gradient for softmax is taken from here](https://github.com/2015xli/multilayer-perceptron/blob/master/multilayer-perceptron-batch.ipynb)
