// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Element = any;
export type Elements = Element[];
export type NArrayInput = Array<Element>;
export type NArrayReduceFunction = (a: number, b: number) => number;
export type NArrayMapFunction = (e: Element, i?: number) => Element;
export type NArrayForEachFunction = (e: Element, i?: number) => void;
