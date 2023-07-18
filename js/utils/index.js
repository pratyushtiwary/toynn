"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_1 = require("../dataset");
const utils = {
    forEach: (arr, func) => {
        const len = arr.length;
        utils.loop({
            start: 0,
            end: len,
            func: (i) => {
                func(arr[i], i);
            },
        });
    },
    map: (arr, func) => {
        let f = [];
        const len = arr.length;
        utils.loop({
            start: 0,
            end: len,
            func: (i) => {
                f.push(func(arr[i], i));
            },
        });
        return f;
    },
    reduce: (arr, func) => {
        let last = arr[0];
        const len = arr.length;
        utils.loop({
            start: 0,
            end: len,
            func: (i) => {
                last = func(last, arr[i]);
            },
        });
        return last;
    },
    loop: ({ start = 0, end, func }) => {
        const len = end;
        let i = start;
        while (i < end) {
            func(i);
            if (i + 1 < len) {
                func(i + 1);
            }
            if (i + 2 < len) {
                func(i + 2);
            }
            if (i + 3 < len) {
                func(i + 3);
            }
            if (i + 4 < len) {
                func(i + 4);
            }
            if (i + 5 < len) {
                func(i + 5);
            }
            if (i + 6 < len) {
                func(i + 6);
            }
            if (i + 7 < len) {
                func(i + 7);
            }
            if (i + 8 < len) {
                func(i + 8);
            }
            if (i + 9 < len) {
                func(i + 9);
            }
            if (i + 10 < len) {
                func(i + 10);
            }
            i += 11;
        }
    },
    shuffle: (arr) => {
        let shuffled, i, temp, index;
        if (arr instanceof dataset_1.Dataset || arr instanceof dataset_1.DatasetSlice) {
            shuffled = [];
            utils.loop({
                start: 0,
                end: arr.length,
                func: (i) => {
                    shuffled[i] = i;
                },
            });
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
            utils.loop({
                start: 0,
                end: arr,
                func: (i) => {
                    shuffled[i] = i;
                },
            });
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
    onehotEncode: ({ x, classes, }) => {
        let result = [];
        if (typeof x === "number") {
            for (let i = 0; i < classes; i++) {
                if (i === x) {
                    result.push(1);
                }
                else {
                    result.push(0);
                }
            }
        }
        if (x instanceof Array) {
            let temp = [];
            for (let i = 0; i < x.length; i++) {
                temp = [];
                for (let j = 0; j < classes; j++) {
                    if (j === x[i]) {
                        temp.push(1);
                    }
                    else {
                        temp.push(0);
                    }
                }
                result.push(temp);
            }
        }
        return result;
    },
    createBatch: ({ array, batchSize }) => {
        if (batchSize <= 0) {
            throw Error(`Invalid batchSize. Make sure batchSize > 0`);
        }
        let batches = [], temp;
        for (let i = 0; i < array.length; i += batchSize) {
            temp = [];
            for (let j = 0; j < batchSize; j++) {
                if (i + j < array.length) {
                    if (array instanceof dataset_1.Dataset || array instanceof dataset_1.DatasetSlice) {
                        temp.push(array.get(i + j));
                    }
                    else if (array instanceof Array) {
                        temp.push(array[i + j]);
                    }
                    else {
                        throw Error(`Failed to fetch element from array. Make sure passed array is of type Array | Dataset | DatasetSlice`);
                    }
                }
            }
            batches.push(temp);
        }
        return batches;
    },
    trainTestSplit: ({ X, y, testSize, shuffle = false, }) => {
        if (X.length !== y.length) {
            throw Error(`Failed to split because X.length != y.length`);
        }
        if (testSize > 1 && testSize <= 100) {
            testSize = testSize / 100;
        }
        else if (testSize > 100) {
            throw Error(`Failed to split because testSize is invalid. Make sure testSize is less than 100`);
        }
        let testStart = X.length - Math.floor(X.length * testSize);
        let trainX, testX, trainY, testY;
        let trainArrangement = [], testArrangement = [];
        if (shuffle) {
            let final = utils.shuffle(X.length);
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
        trainX = new dataset_1.DatasetSlice(X, trainArrangement);
        testX = new dataset_1.DatasetSlice(X, testArrangement);
        trainY = new dataset_1.DatasetSlice(y, trainArrangement);
        testY = new dataset_1.DatasetSlice(y, testArrangement);
        return [trainX, testX, trainY, testY];
    },
};
exports.default = utils;
//# sourceMappingURL=index.js.map