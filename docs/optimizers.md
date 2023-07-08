# Optimizers

Optimizers allows your model to learn learnable parameters, like weights and biases. You can create a custom Optimizer or you can extend an already created Optimizer.

## Optimizer

This class can be imported from `toynn/ts/optimizers` or `toynn/optimizers`

**Note: You can also import optimizers using their alias**

## Types of Optimizers

Currently there is only 1 optimizer which comes pre-built with toynn, GradientDescent.

### GradientDescent

Alias: GD

You can set alpha property as it is public. Alpha defines the learning rate of your model, or in other words it defines how much should your weights and biases be adjusted.

Setting custom alpha

```js
myOptimizer = new toynn.optimizers.GD();

myOptimizer.alpha = 0.001;
```

It is recommended to set a lower alpha value.

Following are the functions supported by GradientDescent optimizer

- process(x: Array<NArray>, y: Array<NArray>): {
  x: Array<NArray>;
  y: Array<NArray>;
  }

This is called by the train function before each epoch. The main objective of this function is to let optimizer arrange data as per its requirement.

- optimize({ x, y, layers }: {NArray, NArray, Array<Layer>})

This function is called by train for optimizing parameters. X and Y passed are single item from the Array<NArray>.

### StochasticGradientDescent

Alias: SGD

This works similar to GD Optimizer the only difference being that every epoch dataset it shuffled randomnly before optimization.

## References

- [Main intution for Gradient Descent](https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/)
- [Logic for weight updation is taken from here](https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/),
- [Logic for bias updation is taken from here](https://stackoverflow.com/a/13342725),
- [SGD Sampling Logic was taken from here](https://stackoverflow.com/a/11935263)
