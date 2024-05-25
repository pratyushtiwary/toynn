"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_1 = require("../dataset");
const utils = {
    /**
     * Reference: https://stackoverflow.com/a/11935263
     */
    shuffle: (arr) => {
        let shuffled, i, temp, index;
        if (arr instanceof dataset_1.Dataset || arr instanceof dataset_1.DatasetSlice) {
            shuffled = [];
            for (let i = 0; i < arr.length; i++) {
                shuffled[i] = i;
            }
            i = arr.length;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            shuffled = new dataset_1.DatasetSlice(arr, shuffled);
        }
        else if (typeof arr === "number") {
            shuffled = [];
            for (let i = 0; i < arr; i++) {
                shuffled[i] = i;
            }
            i = arr;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
        }
        else {
            shuffled = arr.slice(0);
            i = arr.length;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
        }
        return shuffled;
    },
    onehotEncode: (x, classes) => {
        const result = [];
        for (let i = 0; i < classes; i++) {
            if (i === x) {
                result.push(1);
            }
            else {
                result.push(0);
            }
        }
        return result;
    },
    createBatch: (array, batchSize) => {
        if (batchSize <= 0) {
            throw Error(`Invalid batchSize. Make sure batchSize > 0`);
        }
        const batches = [], n = Math.floor(array.length / batchSize);
        let temp, i, arrangement = [];
        for (i = 0; i < n; i++) {
            if (array instanceof Array) {
                temp = array.slice(i * batchSize, (i + 1) * batchSize);
            }
            if (array instanceof dataset_1.Dataset || array instanceof dataset_1.DatasetSlice) {
                arrangement = [];
                for (let j = i * batchSize; j < (i + 1) * batchSize; j++) {
                    arrangement.push(j);
                }
                temp = new dataset_1.DatasetSlice(array, arrangement);
            }
            batches.push(temp);
        }
        if (array.length % batchSize !== 0) {
            if (array instanceof Array) {
                temp = array.slice(i * batchSize, (i + 1) * batchSize);
            }
            if (array instanceof dataset_1.Dataset || array instanceof dataset_1.DatasetSlice) {
                arrangement = [];
                for (let j = i * batchSize; j < (i + 1) * batchSize; j++) {
                    if (j < array.length) {
                        arrangement.push(j);
                    }
                }
                temp = new dataset_1.DatasetSlice(array, arrangement);
            }
            batches.push(temp);
        }
        return batches;
    },
    trainTestSplit: (X, y, { testSize, shuffle = false }) => {
        if (X.length !== y.length) {
            throw Error(`Failed to split because X.length != y.length`);
        }
        if (testSize > 1 && testSize <= 100) {
            testSize = testSize / 100;
        }
        else if (testSize > 100) {
            throw Error(`Failed to split because testSize is invalid. Make sure testSize is less than 100`);
        }
        const testStart = X.length - Math.floor(X.length * testSize);
        const trainArrangement = [], testArrangement = [];
        if (shuffle) {
            const final = utils.shuffle(X.length);
            for (let i = 0; i < X.length; i++) {
                if (i < testStart) {
                    trainArrangement.push(final[i]);
                }
                else {
                    testArrangement.push(final[i]);
                }
            }
        }
        else {
            for (let i = 0; i < X.length; i++) {
                if (i < testStart) {
                    trainArrangement.push(i);
                }
                else {
                    testArrangement.push(i);
                }
            }
        }
        const trainX = new dataset_1.DatasetSlice(X, trainArrangement), testX = new dataset_1.DatasetSlice(X, testArrangement), trainY = new dataset_1.DatasetSlice(y, trainArrangement), testY = new dataset_1.DatasetSlice(y, testArrangement);
        return [trainX, testX, trainY, testY];
    },
};
exports.default = utils;
