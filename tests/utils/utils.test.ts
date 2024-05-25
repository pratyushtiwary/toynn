import { Dataset, DatasetSlice } from "../../dataset";
import NArray from "../../narray";
import utils from "../../utils";

describe("Utils Tests", () => {
  test("shuffle", () => {
    const testData1 = [1, 2, 3, 4, 5];

    const shuffleData1 = utils.shuffle(testData1);

    if (shuffleData1 instanceof Array) {
      expect(testData1).toEqual(shuffleData1.sort());
      expect(testData1).not.toContain(shuffleData1);
    } else {
      expect(true).toBe(false);
    }

    const testData2 = new Dataset([
      new NArray([1, 2, 3]),
      new NArray([4, 5, 6]),
      new NArray([7, 8, 9]),
    ]);

    const shuffleData2 = utils.shuffle(testData2);

    if (shuffleData2 instanceof DatasetSlice) {
      expect(testData2.toArray()).toEqual(shuffleData2.toArray());
      expect(testData2.toArray()).not.toContain(shuffleData2.toArray());
    } else {
      expect(true).toBe(false);
    }

    const testData3 = new DatasetSlice(testData2, [0, 1, 2]);

    const shuffleData3 = utils.shuffle(testData2);

    if (shuffleData3 instanceof DatasetSlice) {
      expect(testData3.toArray()).toEqual(shuffleData3.toArray());
      expect(testData3.toArray()).not.toContain(shuffleData3.toArray());
    } else {
      expect(true).toBe(false);
    }
  });

  test("onehotEncode", () => {
    const classes = 10;

    expect(utils.onehotEncode(2, classes)).toStrictEqual([
      0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    ]);

    expect(utils.onehotEncode(-1, classes)).toStrictEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    expect(utils.onehotEncode(9, classes)).toStrictEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ]);

    expect(utils.onehotEncode(0, classes)).toStrictEqual([
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  test("createBatch", () => {
    const testData1 = NArray.arange(20).real;

    const batch1 = utils.createBatch(testData1, 10);

    try {
      utils.createBatch(testData1, 0);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      utils.createBatch(testData1, -5);
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    expect(batch1).toStrictEqual([
      testData1.slice(0, 10),
      testData1.slice(10, testData1.length),
    ]);

    const testData2 = new Dataset([
      new NArray([1, 2, 3, 4, 5]),
      new NArray([6, 7, 8, 9, 10]),
      new NArray([11, 12, 13, 14, 15]),
      new NArray([16, 17, 18, 19, 20]),
    ]);

    const batch2 = utils.createBatch(testData2, 2);

    expect(batch2.length).toBe(2);

    batch2.forEach((e, i) => {
      if (e instanceof DatasetSlice) {
        expect(e.toArray()).toStrictEqual(
          testData2.toArray().slice(i * 2, (i + 1) * 2),
        );
      } else {
        expect(`${i}th element is not a DatasetSlice!`).toBe(false);
      }
    });

    const testData3 = new DatasetSlice(testData2, [0, 1, 2, 3]);

    const batch3 = utils.createBatch(testData3, 2);

    expect(batch3.length).toBe(2);

    batch3.forEach((e, i) => {
      if (e instanceof DatasetSlice) {
        expect(e.toArray()).toStrictEqual(
          testData3.toArray().slice(i * 2, (i + 1) * 2),
        );
      } else {
        expect(`${i}th element is not a DatasetSlice!`).toBe(false);
      }
    });

    const batch4 = utils.createBatch(testData1, 9);

    expect(batch4).toStrictEqual([
      testData1.slice(0, 9),
      testData1.slice(9, 18),
      testData1.slice(18, 20),
    ]);
  });

  test("trainTestSplit", () => {
    const data = new Dataset([
      new NArray([1, 2, 3]),
      new NArray([4, 5, 6]),
      new NArray([7, 8, 9]),
      new NArray([10, 11, 12]),
      new NArray([13, 14, 15]),
    ]);

    const X = data.slice(0, -1);
    const y = data.slice(-1);

    const [trainX1, testX1, trainY1, testY1] = utils.trainTestSplit(X, y, {
      testSize: 0.2,
    });

    expect(trainX1.length).toBe(4);
    expect(testX1.length).toBe(1);
    expect(trainY1.length).toBe(4);
    expect(testY1.length).toBe(1);

    const [trainX2, testX2, trainY2, testY2] = utils.trainTestSplit(X, y, {
      testSize: 0.2,
      shuffle: true,
    });

    expect(trainX2.length).toBe(4);
    expect(testX2.length).toBe(1);
    expect(trainY2.length).toBe(4);
    expect(testY2.length).toBe(1);

    expect(X.toArray()).toStrictEqual([
      ...trainX2.toArray(),
      ...testX2.toArray(),
    ]);

    expect(X.toArray()).not.toContain([
      ...trainX2.toArray(),
      ...testX2.toArray(),
    ]);

    expect(y.toArray()).toStrictEqual([
      ...trainY2.toArray(),
      ...testY2.toArray(),
    ]);

    expect(y.toArray()).not.toContain([
      ...trainY2.toArray(),
      ...testY2.toArray(),
    ]);

    expect(trainX2.length).toBe(4);
    expect(testX2.length).toBe(1);
    expect(trainY2.length).toBe(4);
    expect(testY2.length).toBe(1);

    expect(X.toArray()).toStrictEqual([
      ...trainX2.toArray(),
      ...testX2.toArray(),
    ]);

    expect(X.toArray()).not.toContain([
      ...trainX2.toArray(),
      ...testX2.toArray(),
    ]);

    expect(y.toArray()).toStrictEqual([
      ...trainY2.toArray(),
      ...testY2.toArray(),
    ]);

    expect(y.toArray()).not.toContain([
      ...trainY2.toArray(),
      ...testY2.toArray(),
    ]);

    const y2 = new Dataset([new NArray([1, 2])]);

    try {
      utils.trainTestSplit(X, y2, {
        testSize: 0.2,
        shuffle: true,
      });
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      utils.trainTestSplit(X, y, {
        testSize: 200,
        shuffle: true,
      });
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }
  });
});
