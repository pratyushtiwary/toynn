import type { OptimizerInput, OptimizerProcessReturn } from './types';

export default class Optimizer {
    alpha: number = undefined;

    public process(
        x: OptimizerProcessReturn['x'],
        y: OptimizerProcessReturn['y']
    ): OptimizerProcessReturn {
        return { x, y };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public optimize({ x, y, layers }: OptimizerInput): void {
        throw Error(`Method not implemented!

    How can you fix this?
    Try overloading the optimize method.`);
    }

    public get steps(): Array<string> {
        throw Error(`Steps not implemented.

    How to fix this?
    If you are the developer, try overwritting the steps getter,
    Else, try raising an issue regarding the same on https://github.com/pratyushtiwary/toynn.`);
    }
}
