import GradientDescent from './gradientDescent';
import { Dataset, DatasetSlice } from '@/dataset';
import utils from '@/utils';

import type { OptimizerProcessReturn } from './types';
import type { Element } from '@/narray/types';

export default class StochasticGradientDescent extends GradientDescent {
    process(
        x: Element[] | Dataset | DatasetSlice,
        y: Element[] | Dataset | DatasetSlice
    ): OptimizerProcessReturn {
        if (x.length !== y.length) {
            throw Error(`X and Y length mismatch

      How can you fix it?
      Make sure that the X and Y passed are of the same length.`);
        }
        let shuffledX: Element[] | DatasetSlice,
            shuffledY: Element[] | DatasetSlice;

        const xLen = x.length;

        const arrangement = utils.shuffle(xLen);

        if (!(arrangement instanceof Array)) {
            throw Error(
                `SGD: Failed to shuffle data. utils.shuffle returned unexpected value.`
            );
        }

        if (x instanceof Dataset || x instanceof DatasetSlice) {
            shuffledX = new DatasetSlice(x, arrangement);
        }

        if (x instanceof Array) {
            shuffledX = [];
            for (let i = 0; i < xLen; i++) {
                shuffledX[i] = x[arrangement[i]];
            }
        }

        if (y instanceof Dataset || y instanceof DatasetSlice) {
            shuffledY = new DatasetSlice(y, arrangement);
        }

        if (y instanceof Array) {
            shuffledY = [];
            for (let i = 0; i < xLen; i++) {
                shuffledY[i] = y[arrangement[i]];
            }
        }

        return { x: shuffledX, y: shuffledY };
    }

    public get steps() {
        return [
            'Shuffle x and y passed before each epochs, then for each epoch follow the below steps',
            ...super.steps,
        ];
    }
}
