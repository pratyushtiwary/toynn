import { Dataset, DatasetSlice } from '@/dataset';
import NArray from '@/narray';
import { Optimizer } from '@/optimizers';

import type { StatErrorInput, StatErrorReturn } from '@/errors/types';

export interface TrainInput {
    x: Array<NArray> | Dataset | DatasetSlice;
    y: Array<NArray> | Dataset | DatasetSlice;
    epochs: number;
    verbose?: boolean;
    alpha?: number;
    optimizer?: Optimizer;
    loss?: (yTrue: StatErrorInput, yPred: StatErrorInput) => StatErrorReturn;
}

export interface ModelFile {
    weights: Array<Array<number>>;
    biases: Array<Array<number>>;
    shape: Array<Array<number>>;
    activationFunctions: string[];
}

export interface ModelFileLayer {
    weights: Array<number>;
    bias: Array<number>;
    shape: Array<number>;
    activationFunction: string;
}
