import fs from 'fs';
jest.mock('fs');

import { Dataset } from '../../dataset';
import errors from '../../errors';
import functions from '../../functions';
import NArray from '../../narray';
import { Layer, NN } from '../../nn';
import { GradientDescent } from '../../optimizers';
test('NN Test', () => {
    const model = new NN('test');

    expect(model.name).toBe('test');

    const layer1 = new Layer(2, 4);
    layer1.use(functions.linear);
    layer1.weights = NArray.zeros(2, 4).map(() => 1);
    layer1.bias = NArray.zeros(1, 4).map(() => 1);
    const layer2 = new Layer(4, 2);
    layer2.use(functions.linear);
    layer2.weights = NArray.zeros(4, 2).map(() => 1);
    layer2.bias = NArray.zeros(1, 2).map(() => 1);
    const layer3 = new Layer(3, 4);

    model.add(layer1);
    model.add(layer2);

    try {
        model.add(layer3);

        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        model.add(1);

        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }

    expect(model.layers).toStrictEqual([layer1, layer2]);

    const inputs = [new NArray([1, 2]).reshape(1, -1), new NArray([3, 4, 5])];

    try {
        model.forward(inputs[1]);

        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }

    expect(model.forward(inputs[0])).toStrictEqual(new NArray([[17, 17]]));

    const structure = `Layer 1: (2, 4), activation function: linear(1) \nLayer 2: (4, 2), activation function: linear(1) \n`;

    expect(model.structure).toBe(structure);

    let optimizer = new GradientDescent();

    optimizer.alpha = 4;

    const output = new NArray([2, 4]);

    const realConsoleLog = console.log;
    console.log = jest.fn() as jest.Mock;
    optimizer.process = jest.fn((x, y) => ({ x, y })) as jest.Mock;
    optimizer.optimize = jest.fn() as jest.Mock;

    model.train({
        x: [inputs[0]],
        y: [output],
        epochs: 1,
        alpha: 0.01,
        optimizer: optimizer,
        loss: errors.MSE,
        verbose: true,
    });

    expect(console.log).toHaveBeenCalled();
    expect(optimizer.process).toHaveBeenCalled();
    expect(optimizer.optimize).toHaveBeenCalled();

    optimizer = new GradientDescent();

    console.log = jest.fn() as jest.Mock;
    optimizer.process = jest.fn((x, y) => ({ x, y })) as jest.Mock;
    optimizer.optimize = jest.fn() as jest.Mock;

    const inputsD = new Dataset([inputs[0]]);
    const outputD = new Dataset([output]);

    model.train({
        x: inputsD,
        y: outputD,
        epochs: 1,
        alpha: 0.01,
        optimizer: optimizer,
        loss: errors.MSE,
        verbose: true,
    });

    expect(console.log).toHaveBeenCalled();
    expect(optimizer.process).toHaveBeenCalled();
    expect(optimizer.optimize).toHaveBeenCalled();

    expect(optimizer.alpha).toBe(0.01);

    optimizer = new GradientDescent();

    console.log = jest.fn() as jest.Mock;
    optimizer.process = jest.fn((x, y) => ({ x, y })) as jest.Mock;
    optimizer.optimize = jest.fn() as jest.Mock;

    model.train({
        x: [inputs[0]],
        y: [output],
        epochs: 1,
        optimizer: optimizer,
    });

    expect(console.log).not.toHaveBeenCalled();
    expect(optimizer.process).toHaveBeenCalled();
    expect(optimizer.optimize).toHaveBeenCalled();

    expect(optimizer.alpha).toBe(0.001);

    console.log = realConsoleLog;

    fs.existsSync = jest.fn(() => true) as jest.Mock;
    fs.writeFileSync = jest.fn((path, _, encoding) => {
        expect(path).toBe('test.json');
        expect(encoding).toBe('utf-8');
    }) as jest.Mock;

    try {
        model.save('./');
        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }

    try {
        model.save('./', true);
        expect(true).toBe(true);
    } catch (_) {
        expect(false).toBe(true);
    }

    const dummyModel = `{"weights": [[1,2,3,4],[1,2,3,4,5,6]],"biases": [[1,2],[1,2,3]],"activationFunctions": ["linear(2)","sigmoid"],"shape": [[2,2],[2,3]]}`;

    fs.readFileSync = jest.fn((filePath, encoding) => {
        expect(filePath).toBe('./model.json');
        expect(encoding).toBe('utf-8');
        return dummyModel;
    }) as jest.Mock;

    const myModel = new NN('testModel');

    myModel.load('./model.json');

    const realExplanation1 = `\nNo. of layers: 2\nEach layers uses the formula: activationFunction(x*weights + bias)\nLayer 1 output: [[16,24]]\nActivation Function Formula: a*x\nActivation Function Gradient Formula: a\n\nLayer 2 output: [[1,1,1]]\nActivation Function Formula: 1/(1+e^-x)\nActivation Function Gradient Formula: sigmoid(x)*(1-sigmoid(x))\n\n`;
    const realExplanation2 = `\nNo. of layers: 2\nEach layers uses the formula: activationFunction(x*weights + bias)\nLayer 1 output: [[4,4,4,4]]\nActivation Function Formula: a*x\nActivation Function Gradient Formula: a\n\nLayer 2 output: [[17,17]]\nActivation Function Formula: a*x\nActivation Function Gradient Formula: a\n\n\n\n----------------- Optimization Steps --------------------\n\n- Find the error, using y^ - y\n- Start from last layer's weights dot product by the transpose of the error, this will provide error for second last layer\n- Perform the above step iteratively for each layer\n- Now that we have each layer's error, iteratively multiply the error's transpose with gradient of that layer's output, this will provide us with layer's gradient\n- Now once we have the layer's gradient, multiply the gradient with the x's transpose provided by you for the 1st layer\n- For 2nd layer till n layer multiply previous layer output's transpose by that layer's gradient\n- For the first time set weights and bias history to 0\n- For each layer calculate the weigths history by multiplying the history with momentum and subtract layer's gradient * alpha\n- Update the history for weights with the output from previous step\n- Now again iterate through layers and add the weights history from that layer's weight\n- For bias, simply find the gradient of each layer's output\n- Calculate history using the same method for bias\n- Then add the history to that layer's bias\nNote: You can get gradient for activation functions by using \`activationFunction.gradient\``;

    expect(myModel.explain(inputs[0])).toBe(realExplanation1);
    expect(model.explain(inputs[0])).toBe(realExplanation2);

    const layers = myModel.layers;

    const realWeights = [
        new NArray([1, 2, 3, 4]),
        new NArray([1, 2, 3, 4, 5, 6]),
    ];
    const realBiases = [new NArray([1, 2]), new NArray([1, 2, 3])];
    const realShapes = [
        [2, 2],
        [2, 3],
    ];
    const realFunctions = ['linear(2)', 'sigmoid'];

    layers.forEach((e, i) => {
        expect(e.weights).toStrictEqual(realWeights[i]);
        expect(e.bias).toStrictEqual(realBiases[i]);
        expect(e.shape).toStrictEqual(realShapes[i]);
        expect(e.activationFunction.toString()).toBe(realFunctions[i]);
    });

    const dummyCorruptModel1 = `{"weights": [[1,2,3,4],[1,2,3,4,5,6]],"biases": [[1,2],[1,2,3]],"activationFunctions": ["linear(2)","test"],"shape": [[2,2],[2,3]]}`;
    fs.readFileSync = jest.fn((filePath, encoding) => {
        expect(filePath).toBe('./model.json');
        expect(encoding).toBe('utf-8');
        return dummyCorruptModel1;
    }) as jest.Mock;

    try {
        myModel.load('./model.json');
        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }

    const dummyCorruptModel2 = `"weights": [[1,2,3,4],[1,2,3,4,5,6]],"biases": [[1,2],[1,2,3]],"activationFunctions": ["linear(2)","test"],"shape": [[2,2],[2,3]]}`;
    fs.readFileSync = jest.fn((filePath, encoding) => {
        expect(filePath).toBe('./model.json');
        expect(encoding).toBe('utf-8');
        return dummyCorruptModel2;
    }) as jest.Mock;

    try {
        myModel.load('./model.json');
        expect(false).toBe(true);
    } catch (_) {
        expect(true).toBe(true);
    }
});
