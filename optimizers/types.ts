import NArray from '@/narray';
import { Dataset, DatasetSlice } from '@/dataset';
import { Layer } from '@/nn';

import type { Elements } from '@/narray/types';

export interface OptimizerProcessReturn {
    x: Elements | Dataset | DatasetSlice;
    y: Elements | Dataset | DatasetSlice;
}

export interface OptimizerInput {
    x: NArray;
    y: NArray;
    layers: Array<Layer>;
}

export interface OptimizerOutput {
    weightGradients: Array<NArray>;
    biasGradients: Array<NArray>;
    adjustedWeights: Array<NArray>;
    adjustedBiases: Array<NArray>;
}

export interface GradientDescentInput {
    momentum?: number;
}
