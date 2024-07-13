---
title: Intro to NN
description: A guide to how you can use NN
sidebar:
  order: 1
---

NN acts as a skeleton which keeps your [Layers](/nn/layers) in place.

You can create a model without using this class by implementing custom logic.

## Usage

```js
import toynn from "toynn";

const myModel = new toynn.NN("modelName");
```

## Methods

### add

```
Signature: add(obj: Layer)
```

Use this to add new [Layer](/nn/layers) to your model

### forward

```
Signature: forward(x: NArray): NArray
```

Forward your neural network single step. You can use this function to make predictions

### train

```
Signature: train({
    x,
    y,
    epochs,
    alpha = 0.001,
    verbose = false,
    loss = errors.RSS,
    optimizer = new GradientDescent(),
  }: TrainInput)
```

Use this function to train your model.

- Epochs: Amount of time the model will see your data,
- Alpha: Learning Rate,
- Verbose: If set to true, prints epoch number and accuracy,
- Loss: Used to calculate loss, which is then used to calculate accuracy,
- Optimizer: Element which optimizes your model

### explain

```
Signature: explain(x: NArray): String
```

Returns the explanation of possibly what's going on under the hood based on the x passed.

### save

```
Signature: save(filePath: string = "./")
```

Saves the model to the specified file path. The name of file will be `modelName.json`, where name is name of the model defined when creating the object.

### load

```
Signature: load(filePath: string)
```

Loads the model from specified file path.

## Properties

### structure

Returns [Layer's](/nn/layers) configuration in form of a String

### layers

Returns array of [layers](/nn/layers)
