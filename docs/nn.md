# NN

This class acts as a skeleton which keeps your Layers in place.

You can create a model without using this class.

## Usage:

```js
// import

const myModel = new NN("modelName");
```

## Member functions of NN class

- add(obj: Layer)

Use this to add new Layer to your model

- forward(x: NArray): NArray

You can use this function to make predictions.

- train({
  x,
  y,
  epochs,
  alpha = 0.001,
  verbose = false,
  loss = errors.RSS,
  optimizer = new GradientDescent(alpha),
  })

Use this function to train your model.

Epochs: Amount of time the model will see your data,
Alpha: Learning Rate,
Verbose: If set to true, prints epoch number and accuracy,
Loss: Used to calculate loss, which is then used to calculate accuracy,
Optimizer: Element which optimizes your model

- structure: String

Returns Layer's configuration in form of a String

- explain(x: NArray): String

Returns the explanation of possibly what's going on under the hood based on the x passed.

## Layer

Encapsulation of a single layer in a neural network

### constructor(inputSize, outputSize)

Weights and biases are generated here based on random normal distribution numbers

### forward(x: NArray): NArray

Same as NN.forward but only forwards a single layer

### weights: NArray

Weights for the layer

### bias: NArray

Bias for the layer

### set weights

You can set weights manually as well. Make sure that new weights are NArray and their shape matches your Layer's inputSize and outputSize

If layer is of shape (50,10), where inputSize = 50 and outputSize = 10,
then weights should be of shape (50,10)

### set bias

You can set bias manually as well. Make sure that new bias are NArray and their shape matches your Layer's outputSize

If layer is of shape (50,10), where inputSize = 50 and outputSize = 10,
then bias should be of shape (1,10)

### use(obj:ActivationFunction)

You can use it to set which activation funtion should be used by the Layer while forwarding

### activationFunction

You can use it as both a getter and a setter.

As getter:
Layer.activationFunction

As setter:
Layer.activationFunction = functions.sigmoid

### shape

Returns shape of the layer

### name

Name of your layer

You can use it as getter and setter

## References

- [Optimization for weights in gradient descent is taken from here along with Layer's logic](https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/)
