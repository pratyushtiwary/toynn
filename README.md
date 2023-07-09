<p align="center">
  <img src="./logo.png" alt="toynn">
</p>
<p align="center">A toy NN library for JS to play and learn NN concepts.</p>
<p align="center">
  <b>Note: You can use `ts` version by import "toynn/ts", by default JS version is exported</b>
</p>
## Installation

`npm install toynn` or `yarn add toynn`

## Usage

The below model is based on AND's truth table.

Using JS:

```js
const toynn = require("toynn");

const model = new toynn.NN("myModel");

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

const layer1 = new toynn.Layer(2, 10);
layer1.activationFunction = toynn.functions.sigmoid;
const layer2 = new toynn.Layer(10, 2);
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
console.log(model.forward(newData).max().index); // 0
```

Using TS:

```ts
const toynn = require("toynn/ts");

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
console.log(model.forward(newData).max().index); // 0
```

**Note: If you want to use import syntax in JS you can use the following `import toynn from "toynn/js"`**

## Docs

Checkout the [`docs`](docs) folder for documentation regarding different classes.

## References

Checkout each respective docs file's References section
