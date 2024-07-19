import fs from 'fs';
import path from 'path';

import Layer from './layer';
import { Optimizer, GradientDescent } from '@/optimizers';
import NArray from '@/narray';
import errors from '@/errors';
import { Dataset, DatasetSlice } from '@/dataset';
import functions, { ActivationFunction } from '@/functions';

// types
import type { TrainInput, ModelFile, ModelFileLayer } from './types';
import type { Elements } from '@/narray/types';

export default class NN {
    #layers: Array<Layer> = [];
    #name: string = undefined;
    #trained: boolean = false;
    #lastOptimizerUsed: Optimizer;

    /**
     * Takes in a name and allows users to create a skeleton which holds layer and activation function
     * Object of this class also allows user to backpropogate and predict
     *
     * @param name: str -> Name of the model. This name will later be used to load and save model
     *
     * Reference: https://www.geeksforgeeks.org/implementation-of-neural-network-from-scratch-using-numpy/amp/,
     */
    constructor(name: string) {
        this.#name = name;
    }

    get layers(): Array<Layer> {
        return Array.from(this.#layers);
    }

    get name() {
        return this.#name;
    }

    add(obj: Layer) {
        /**
         * Adds a layer or activation function to the neural network
         *
         * @param obj: <Layer, Function>
         */
        if (obj instanceof Layer) {
            const inputSize = obj.shape[0];

            if (this.#layers.length > 0) {
                const prevOutputSize =
                    this.#layers[this.#layers.length - 1]?.shape[1];

                if (inputSize !== prevOutputSize) {
                    throw Error(
                        `Layer's input size doesn't match with previous layer's output size! Make sure the output of previous layer is equal to the input of this layer

            How to fix this?
            Make sure that layer ${
                this.#layers.length + 1
            }'s input size = ${prevOutputSize}`
                    );
                }
            }
            this.#layers.push(obj);
        } else {
            throw Error(`Unable to add the passed object to the model's pipeline.

      How to fix this?
      The object you passed to is not a Layer, try to pass Layer's object`);
        }
    }

    forward(x: Array<Element> | NArray): NArray {
        if (!(x instanceof NArray) && x instanceof Array) {
            x = new NArray(x);
        } else if (!(x instanceof NArray)) {
            throw Error(`Invalid input for model ${this.name}

      How to fix this?
      Convert your x to NArray`);
        }
        let recent: NArray;
        this.#layers.forEach((e: Layer, i: number) => {
            if (i === 0) {
                recent = e.forward(x);
            } else {
                recent = e.forward(recent);
            }
        });

        return recent;
    }

    train({
        x,
        y,
        epochs,
        alpha = 0.001,
        verbose = false,
        loss = errors.RSS,
        optimizer = new GradientDescent(),
    }: TrainInput) {
        this.#trained = true;
        optimizer.alpha = alpha;
        const losses = [],
            accuracies = [];
        let l: Elements;
        let tempX: NArray, tempY: NArray;
        for (let i = 0; i < epochs; i++) {
            ({ x, y } = optimizer.process(x, y));
            l = [];
            for (let j = 0; j < x.length; j++) {
                if (x instanceof Array) {
                    tempX = x[j];
                }

                if (y instanceof Array) {
                    tempY = y[j];
                }

                if (x instanceof Dataset || x instanceof DatasetSlice) {
                    tempX = x.get(j);
                }

                if (y instanceof Dataset || y instanceof DatasetSlice) {
                    tempY = y.get(j);
                }

                if (!(tempX instanceof NArray)) {
                    throw Error(`Make sure x's elements are of type NArray`);
                }

                if (!(tempY instanceof NArray)) {
                    throw Error(`Make sure y's elements are of type NArray`);
                }

                const out = this.forward(tempX);
                l.push(loss(tempY.flatten(), out.flatten()).result);
                optimizer.optimize({
                    x: tempX,
                    y: tempY,
                    layers: this.#layers,
                });
            }
            losses[i] = errors.mean(l);
            accuracies[i] = 1 - losses[i];
            if (verbose) {
                console.log(
                    `Epoch: ${i + 1}, accuracy: ${accuracies[i] * 100}`
                );
            }
        }
        this.#lastOptimizerUsed = optimizer;
        return [losses, accuracies];
    }

    get structure(): string {
        let structure = ``;

        this.#layers.forEach((e, i) => {
            structure += `Layer ${i + 1}: (${e.inputSize}, ${
                e.outputSize
            }), activation function: ${e.activationFunction.toString()} \n`;
        });
        structure = structure.replace('\n$', '');
        return structure;
    }

    explain(x: NArray): string {
        let explanation = `\n`;
        let recent: NArray;

        explanation += `No. of layers: ${this.#layers.length}\n`;

        explanation += `Each layers uses the formula: activationFunction(x*weights + bias)\n`;

        this.#layers.forEach((e, i) => {
            if (i === 0) {
                recent = e.forward(x);
                explanation += `Layer 1 output: ${recent.toString()}\n`;
            } else {
                recent = e.forward(recent);
                explanation += `Layer ${i + 1} output: ${recent.toString()}\n`;
            }
            explanation += `Activation Function Formula: ${e.activationFunction.formula}\n`;
            explanation += `Activation Function Gradient Formula: ${e.activationFunction.gradient}\n\n`;
        });

        if (this.#trained) {
            explanation += `\n\n----------------- Optimization Steps --------------------\n\n`;
            explanation += this.#lastOptimizerUsed.steps
                .map((e) => (e.toLowerCase().startsWith('note') ? e : '- ' + e))
                .join('\n');
        }

        return explanation;
    }

    save(savePath: string = './', force = false) {
        const finalPath = path.join(savePath, this.name + '.json');
        const contents = {
            weights: [],
            biases: [],
            activationFunctions: [],
            shape: [],
        };

        this.#layers.forEach((e, i) => {
            contents['weights'][i] = e.weights.flatten();
            contents['biases'][i] = e.bias.flatten();
            contents['activationFunctions'][i] =
                e.activationFunction.toString();
            contents['shape'][i] = e.shape;
        });

        if (fs.existsSync(finalPath) && !force) {
            throw Error(`File already exists at path ${finalPath}.

      How to fix this?
      Try renaming the file at path ${finalPath}.`);
        }

        fs.writeFileSync(finalPath, JSON.stringify(contents, null, 4), 'utf-8');
    }

    load(filePath: string) {
        try {
            const data: ModelFile = JSON.parse(
                fs.readFileSync(filePath, 'utf-8')
            );
            let tempLayer: ModelFileLayer,
                tempActivationFunction: ActivationFunction,
                tempActivationFunctionName: string,
                activationFuntionParams: string | Array<Element>;

            for (let i = 0; i < data.weights.length; i++) {
                tempLayer = {
                    weights: data.weights[i],
                    bias: data.biases[i],
                    shape: data.shape[i],
                    activationFunction: data.activationFunctions[i],
                };
                this.#layers[i] = new Layer(
                    tempLayer.shape[0],
                    tempLayer.shape[1]
                );

                this.#layers[i].weights = new NArray(tempLayer.weights).reshape(
                    tempLayer.shape[0],
                    tempLayer.shape[1]
                );
                this.#layers[i].bias = new NArray(tempLayer.bias).reshape(
                    1,
                    tempLayer.shape[1]
                );

                tempActivationFunctionName =
                    tempLayer.activationFunction.replace(
                        /([\w\W]*)+\(+([\w\W]*)+\)/gi,
                        '$1'
                    );

                // check if activation function exists
                tempActivationFunction = functions[tempActivationFunctionName];

                if (!tempActivationFunction) {
                    throw Error(
                        `Failed to load activation function ${
                            tempLayer.activationFunction
                        } for layer ${i + 1}`
                    );
                }

                if (
                    tempLayer.activationFunction.match(
                        /([\w\W]*)+\(+([\w\W]*)+\)/gi
                    )
                ) {
                    activationFuntionParams =
                        '[' +
                        tempLayer.activationFunction.replace(
                            /([\w\W]*)+\(+([\w\W]*)+\)/gi,
                            '$2'
                        ) +
                        ']';

                    activationFuntionParams = JSON.parse(
                        activationFuntionParams.replace(/\'/g, '"')
                    );

                    tempActivationFunctionName =
                        tempActivationFunctionName[0].toUpperCase() +
                        tempActivationFunctionName.slice(1);
                    tempActivationFunction = new functions[
                        tempActivationFunctionName
                    ](...activationFuntionParams);
                    this.#layers[i].activationFunction = tempActivationFunction;
                } else {
                    this.#layers[i].activationFunction = tempActivationFunction;
                }
            }
        } catch (e) {
            throw Error(`Failed to load model.

      Error: ${e}`);
        }
    }
}
