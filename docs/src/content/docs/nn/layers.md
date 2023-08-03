---
title: Intro to Layers
description: A guide to how you can use Layers
---

Layer is encapsulation of a single layer in a neural network

## Creating a layer

Layer's constructor takes an input and output size.

```js
import toynn from "toynn";

const myLayer = new toynn.Layer(4, 5); // inputSize: 4, outputSize: 5
```

## Methods

### forward

```
Signature: forward(x: NArray): NArray
```

Forward your layer single step. You can use this function to make predictions

### use

```
Signature: use(obj:[ActivationFunction](/functions/intro))
```

You can use it to set which [activation function](/functions/intro) should be used by the Layer while forwarding.

## Properties

### weights

You can use this property to get or set weights. If you are setting weights make sure you are passing NArray object.

```js
import toynn from "toynn";

const myWeights = toynn.NArray.arange(500).reshape(50, 10);
const myWeightsArray = myWeights.real; // this is now an Array
const myLayer = new toynn.Layer(50, 10);

myLayer.weights = myWeights; // ✔
myLayer.weights = myWeightsArray; // ❌
```

**Note: Make sure that new weights are NArray and their shape matches your Layer's inputSize and outputSize. If layer is of shape (50,10), where inputSize = 50 and outputSize = 10, then weights should be of shape (50,10)**

### bias

You can use this property to get or set bias. If you are setting weights make sure you are passing NArray object.

```js
import toynn from "toynn";

const myBias = toynn.NArray.arange(10).reshape(1, 10);
const myBiasArray = myBias.real; // this is now an Array
const myLayer = new toynn.Layer(50, 10);

myLayer.bias = myBias; // ✔
myLayer.bias = myBiasArray; // ❌
```

**Note: Make sure that new bias shape matches your Layer's outputSize. If layer is of shape (50,10), where inputSize = 50 and outputSize = 10, then bias should be of shape (1,10)**

### activationFunction

Use it to set [activation function](/functions/intro) for your layer.

[use()](#use) can be used to perform the same functionality as well.

### shape

Returns shape of the Layer as array

### name

You can use it to name your layers

```js
import toynn from "toynn";

const myLayer = new toynn.Layer(50, 10);

myLayer.name = "myLayer";

console.log(myLayer.name); // myLayer
```

## References

Some of the functionality is implemented using the awesome resources from the internet.

- ✨ [Optimization for weights in gradient descent is taken from here along with Layer's logic](https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/)
