import ActivationFunction from "./base";

// functions
import Sigmoid from "./sigmoid";
import Relu from "./relu";
import LeakyRelu from "./leakyRelu";
import Softmax from "./softmax";
import Tanh from "./tanh";
import Linear from "./linear";

export const functions = {
  sigmoid: new Sigmoid(),
  relu: new Relu(),
  leakyRelu: new LeakyRelu(),
  softmax: new Softmax(),
  tanh: new Tanh(),
  linear: new Linear(),
  Sigmoid,
  Relu,
  LeakyRelu,
  Softmax,
  Tanh,
  Linear,
};

export { ActivationFunction };

export default {
  ...functions,
  ActivationFunction,
};
