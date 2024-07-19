import StochasticGradientDescent from './stochasticGradientDescent';
import { Layer } from '@/nn';
import NArray from '@/narray';

export default class RMSProp extends StochasticGradientDescent {
    protected calcUpdates(
        layers: Layer[],
        weightGradients: NArray[],
        biasGradients: NArray[]
    ): NArray[][] {
        const adjustedBiases = [],
            adjustedWeights = [];

        for (let i = 0; i < layers.length; i++) {
            if (weightGradients[i] instanceof NArray) {
                // momentum logic for weights
                this.weightsHistory[i] = this.weightsHistory[i]
                    .mul(this.momentum)
                    .add(weightGradients[i].pow(2).mul(1 - this.momentum));

                adjustedWeights[i] = layers[i].weights.sub(
                    weightGradients[i]
                        .div(
                            this.weightsHistory[i]
                                .add(this.EPSILON)
                                .map(Math.sqrt)
                        )
                        .mul(this.alpha)
                );
            }

            // momentum logic for bias
            this.biasHistory[i] = this.biasHistory[i]
                .mul(this.momentum)
                .add(biasGradients[i].pow(2).mul(1 - this.momentum));

            adjustedBiases[i] = layers[i].bias.sub(
                biasGradients[i]
                    .div(this.biasHistory[i].add(this.EPSILON).map(Math.sqrt))
                    .mul(this.alpha)
            );
        }

        return [adjustedBiases, adjustedWeights];
    }

    get steps() {
        return [
            ...super.steps.slice(0, 8),
            "For each layer calculate the weigths history by multiplying the history with momentum and add layer's gradient^2 * (1-momentum)",
            super.steps[10],
            "Now again iterate through layers and subtract the weights gradient divided by square root of (weight history + EPSILON) from that layer's weight",
            ...super.steps.slice(12),
        ];
    }
}
