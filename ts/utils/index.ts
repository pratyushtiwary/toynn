import { Dataset, DatasetSlice } from "../dataset";

export interface LoopInput {
  start?: number;
  end: number;
  func: (i: number) => void;
}

export interface TrainTestSplitInput {
  testSize: number;
  shuffle?: boolean;
}

const utils = {
  forEach: (arr: Array<any>, func: Function): void => {
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        func(arr[i], i);
      },
    });
  },
  map: (arr: Array<any>, func: Function): Array<any> => {
    let f = [];
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        f.push(func(arr[i], i));
      },
    });
    return f;
  },
  reduce: (arr: Array<any>, func: Function): number => {
    let last = arr[0];
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        last = func(last, arr[i]);
      },
    });
    return last;
  },
  loop: ({ start = 0, end, func }: LoopInput) => {
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

  /**
   * Reference: https://stackoverflow.com/a/11935263
   */
  shuffle: (
    arr: number | Array<any> | Dataset | DatasetSlice
  ): Array<number> | DatasetSlice => {
    let shuffled: Array<any> | DatasetSlice,
      i: number,
      temp: any,
      index: number;
    if (arr instanceof Dataset || arr instanceof DatasetSlice) {
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

      shuffled = new DatasetSlice(arr, shuffled);
    } else if (typeof arr === "number") {
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
    } else {
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
  onehotEncode: (x: number, classes: number): Array<number> => {
    let result = [];

    for (let i = 0; i < classes; i++) {
      if (i === x) {
        result.push(1);
      } else {
        result.push(0);
      }
    }

    return result;
  },
  createBatch: (
    array: Array<any> | Dataset | DatasetSlice,
    batchSize: number
  ): Array<Array<any>> => {
    if (batchSize <= 0) {
      throw Error(`Invalid batchSize. Make sure batchSize > 0`);
    }
    let batches = [],
      temp: Array<any> | DatasetSlice,
      n = Math.floor(array.length / batchSize),
      i: number,
      arrangement = [];

    for (i = 0; i < n; i++) {
      if (array instanceof Array) {
        temp = array.slice(i * batchSize, (i + 1) * batchSize);
      }

      if (array instanceof Dataset || array instanceof DatasetSlice) {
        arrangement = [];
        for (let j = i * batchSize; j < (i + 1) * batchSize; j++) {
          arrangement.push(j);
        }
        temp = new DatasetSlice(array, arrangement);
      }
      batches.push(temp);
    }

    if (array.length % batchSize !== 0) {
      if (array instanceof Array) {
        temp = array.slice(i * batchSize, (i + 1) * batchSize);
      }

      if (array instanceof Dataset || array instanceof DatasetSlice) {
        arrangement = [];
        for (let j = i * batchSize; j < (i + 1) * batchSize; j++) {
          if (j < array.length) {
            arrangement.push(j);
          }
        }
        temp = new DatasetSlice(array, arrangement);
      }
      batches.push(temp);
    }

    return batches;
  },
  trainTestSplit: (
    X: Dataset,
    y: Dataset,
    { testSize, shuffle = false }: TrainTestSplitInput
  ): DatasetSlice[] => {
    if (X.length !== y.length) {
      throw Error(`Failed to split because X.length != y.length`);
    }

    if (testSize > 1 && testSize <= 100) {
      testSize = testSize / 100;
    } else if (testSize > 100) {
      throw Error(
        `Failed to split because testSize is invalid. Make sure testSize is less than 100`
      );
    }
    let testStart = X.length - Math.floor(X.length * testSize);
    let trainX: DatasetSlice,
      testX: DatasetSlice,
      trainY: DatasetSlice,
      testY: DatasetSlice;
    let trainArrangement = [],
      testArrangement = [];
    if (shuffle) {
      let final = utils.shuffle(X.length);

      for (let i = 0; i < X.length; i++) {
        if (i < testStart) {
          trainArrangement.push(final[i]);
        } else {
          testArrangement.push(final[i]);
        }
      }
    } else {
      for (let i = 0; i < X.length; i++) {
        if (i < testStart) {
          trainArrangement.push(i);
        } else {
          testArrangement.push(i);
        }
      }
    }
    trainX = new DatasetSlice(X, trainArrangement);
    testX = new DatasetSlice(X, testArrangement);
    trainY = new DatasetSlice(y, trainArrangement);
    testY = new DatasetSlice(y, testArrangement);

    return [trainX, testX, trainY, testY];
  },
};
export default utils;
