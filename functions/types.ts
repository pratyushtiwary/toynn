import NArray from '@/narray';

export type ActivationFunctionResult = NArray;
export type ActivationFunctionInput = NArray;

export interface ActivationFunctionType {
    formula: string;
    gradient: string;
    calcGradient: (x: ActivationFunctionResult) => ActivationFunctionResult;
    calculate: (x: ActivationFunctionInput) => ActivationFunctionResult;
    toString: () => string;
}
