<p align="center">
  <img src="./logo.svg" alt="toynn">
</p>
<p align="center">A toy NN library for JS to play and learn NN concepts.</p>
<p align="center">
  <b>Note: You can use `ts` version by importing from "toynn/ts", by default JS version is exported</b>
</p>
<p align="center">
  <b>Contribution is much appreciated, if you feel like something is not right or you've found some bug feel free to raise an issue or create a PR</b>
</p>

## Requirements

[NodeJS](https://nodejs.org/) v18.0.0 or higher must be installed to use `toynn`.

## Installation

| **Source** | **Info**            |
| ---------- | ------------------- |
| npm        | `npm install toynn` |
| yarn       | `yarn add toynn`    |

## Usage

```js
import toynn from "toynn";

const model: toynn.NN = new toynn.NN("myModel");

const x = [
  new toynn.NArray([0, 0]).reshape(1, 2),
  new toynn.NArray([0, 1]).reshape(1, 2),
  new toynn.NArray([1, 1]).reshape(1, 2),
];

const y = [
  new toynn.NArray([1, 0]),
  new toynn.NArray([1, 0]),
  new toynn.NArray([0, 1]),
];

const layer1: toynn.Layer = new toynn.Layer(2, 10);
layer1.activationFunction = toynn.functions.sigmoid;
const layer2: toynn.Layer = new toynn.Layer(10, 2);
layer2.activationFunction = toynn.functions.sigmoid;

model.add(layer1);
model.add(layer2);

model.train({
  x,
  y,
  verbose: true,
  loss: toynn.errors.MSE,
  epochs: 100,
  alpha: 0.001,
});

// Make prediction
const newData = new toynn.NArray([1, 0]).reshape(1, 2);
console.log(model.forward(newData).max().index);
```

**Note: The above code only supports v2.0.0 or above**

**You can use the library with typescript also. The code remains the same.**

## Docs

Checkout [`wiki`](https://github.com/pratyushtiwary/toynn/wiki) for documentation regarding different classes.
