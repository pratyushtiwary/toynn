# Functions

Contains Activation Functions which can be passed to Layer.

## ActivationFunction Base Class

You can create your custom activation functions by creating a new class and extending the ActivationFunction class.

Your activation function should have the following attributes and functions :

- get formula

This should return your activation function's formula,

- get gradient

This should return your activation function's gradient formula,

- calcGradient(x: NArray): NArray

It should return the gradient for the provided x

- calculate(x: NArray)

It should return the values of x for your activation function

## Avaiable Activation Functions

- Sigmoid,
- ReLU,
- LeakyReLU,
- Softmax,
- Tanh

You can use formula and gradient getter to get the respective values.

## References

- https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/ :- Most of the activation function's formula and gradient is taken from here,
- https://github.com/2015xli/multilayer-perceptron/blob/master/multilayer-perceptron-batch.ipynb :- Gradient for softmax is taken from here
