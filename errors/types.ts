export type StatErrorInput = Array<number>;

export type StatErrorApplyFunction = (
    result: StatErrorReturn['result']
) => StatErrorReturn['result'];
export type StatErrorUseFunction = (result: number) => number;

export type StatErrorApply = (func: StatErrorApplyFunction) => StatErrorReturn;

export interface StatErrorReturn {
    apply: StatErrorApply;
    result: number | Array<number>;
    formula: string;
}
