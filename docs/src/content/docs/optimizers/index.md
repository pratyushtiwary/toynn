---
title: Intro to Optimizers
description: A guide to how you can use Optimizers
sidebar:
  order: 1
---

Optimizers allow your model to learn learnable parameters, like weights and biases. You can create a custom Optimizer or you can extend an already created Optimizer or you can use premade optimizers.

**Note: You can also import optimizers using their alias**

## Usage

```js
import toynn from "toynn";

const myOptimizer = new toynn.optimizers.GD({ momentum: 0.9 }); // GD is alias for GradientDescent

myOptimizer.alpha = 0.001;
```

## Premade Optimizers

Following are the optimizers that `toynn` comes packed with:

### GradientDescent

Alias: GD

#### Usage

```js
import toynn from "toynn";

const myOptimizer = new toynn.optimizers.GD({ momentum: 0.9 }); // GD is alias for GradientDescent

myOptimizer.alpha = 0.001;
```

You can set the alpha property as it is public. Alpha defines the learning rate of your model, or in other words, it defines how much should your weights and biases be adjusted.

It is recommended to set a lower alpha value.

**Note: All other optimizers are extended from Gradient Descent Optimizer**

#### Methods

##### process

```
Signature: process(x: Array, y: Array): { x: Array; y: Array; }
```

This is called by the train function before each epoch. The main objective of this function is to let the optimizer arrange data as per its requirement.

##### optimize

```
Signature: optimize({ x, y, layers }: {NArray, NArray, Array})
```

This function is called by train for optimizing parameters. X and Y passed are single items from the Array.

#### Properties

##### steps

Returns list of steps used to optimize

### StochasticGradientDescent

Alias: SGD

This optimizer is extended from GradientDescent optimizer.

This works similarly to GD Optimizer the only difference being that every epoch dataset is shuffled randomly before optimization.

### RMSProp

This optimizer is extended from GradientDescent optimizer.

This works similarly to GD Optimizer the only difference being that the rate of change is changed based on gradient and history of layer.

## Custom Optimizer

You can extend the `Optimizer` class to create a custom optimizer.

[`GradientDescent`](#gradientdescent) optimizer extends this class.

```js
class GradientDescent extends Optimizer {
  /**
   *
   * References:
   *  - https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/,
   *  - https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
   *  - https://stackoverflow.com/a/13342725
   */

  protected momentum: number;
  protected weightsHistory: Array<NArray> = [];
  protected biasHistory: Array<NArray> = [];
  protected EPSILON: number = Number.EPSILON;

  constructor(options: GradientDescentInput = { momentum: 0.9 }) {
    super();
    // initialization logic
  }

  process(
    x: any[] | Dataset | DatasetSlice,
    y: any[] | Dataset | DatasetSlice
  ): OptimizerProcessReturn {
    // process logic
  }

  optimize({ x, y, layers }: OptimizerInput): void {
    // optimize logic
  }

  public get steps() {
    // steps logic
  }
}
```

## References

Some of the functionality is implemented using the awesome resources from the internet.

- ✨ [Main intuition for Gradient Descent](https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/),
- ✨ [Logic for weight updation is taken from here,](https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/),
- ✨ [Logic for bias updation is taken from here,](https://stackoverflow.com/a/13342725),
- ✨ [SGD Sampling Logic was taken from here,](https://stackoverflow.com/a/11935263),
- ✨ [RMSProp implementation was taken from here](https://q-viper.github.io/2020/06/05/writing-popular-machine-learning-optimizers-from-scratch-on-python/#25-rms-prop)
