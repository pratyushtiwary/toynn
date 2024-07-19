import Optimizer from './base';
import GradientDescent from './gradientDescent';
import StochasticGradientDescent from './stochasticGradientDescent';
import RMSProp from './rmsProp';

const GD = GradientDescent;
const SGD = StochasticGradientDescent;

const optimizers = {
    Optimizer,
    GradientDescent,
    StochasticGradientDescent,
    GD,
    SGD,
    RMSProp,
};

export {
    Optimizer,
    GradientDescent,
    StochasticGradientDescent,
    GD,
    SGD,
    RMSProp,
};

export default optimizers;
