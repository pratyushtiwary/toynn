# Optimizers

Optimizers allows your model to learn learnable parameters, like weights and biases. You can create a custom Optimizer or you can extend an already created Optimizer.

## Optimizer

This class can be imported from `toynn/ts/optimizers` or `toynn/optimizers`

## Types of Optimizers

Currently there is only 1 optimizer which comes pre-built with toynn, GradientDescent.

### GradientDescent

It only take alpha as its constructors parameter. Alpha defines the learning rate of your model, or in other words it defines how much should your weights and biases be adjusted.

It is recommended to set a lower alpha value.

Following are the functions supported by GradientDescent optimizer

- process(x: Array<NArray>, y: Array<NArray>): {
  x: Array<NArray>;
  y: Array<NArray>;
  }

This is called by the train function before starting the optimization. The main objective of this function is to let optimizer arrange data as per its requirement.

- optimize({ x, y, layers }: {NArray, NArray, Array<Layer>})

This function is called by train for optimizing parameters. X and Y passed are single item from the Array<NArray>.

## References

- https://www.geeksforgeeks.org/how-to-implement-a-gradient-descent-in-python-to-find-a-local-minimum/ :- Main intution for Gradient Descent
- https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/ :- Logic for weight updation is taken from here,
- https://stackoverflow.com/a/13342725 :- Logic for bias updation is taken from here
