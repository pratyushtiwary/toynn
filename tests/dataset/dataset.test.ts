import fs from "fs";
import readline from "readline";
import NArray from "../../narray";
import createMockCache from "../__mocks__/mockCache";
const data = `a,b,c\n1,2,3\n4,5,6\n"7",8,9`;

const mockedCache = createMockCache({
  "test.csv": {
    name: "test.csv",
    cachedAt: 1, // set to 0 to expire entry
    content: data,
  },
});

const expectedData = [
  new NArray([1, 2, 3]),
  new NArray([4, 5, 6]),
  new NArray(["7", 8, 9]),
];

jest.mock("../../utils/cache", () => mockedCache);

const text = jest.fn(() => Promise.resolve(data));

global.fetch = jest.fn((url) => {
  if (url !== "https://example.com/test.csv")
    Promise.resolve({
      ok: false,
    });
  return Promise.resolve({
    text,
    ok: true,
  });
}) as jest.Mock;

fs.createReadStream = jest.fn((path) => {
  if (path !== "./test.csv") throw Error("Failed to read file");

  return data;
}) as jest.Mock;

readline.createInterface = jest.fn(() =>
  data.split("\n").map((e) => Promise.resolve(e)),
) as jest.Mock;

import dataset from "../../dataset";

describe("Dataset Tests", () => {
  test("Create dataset from NArray Array", async () => {
    const myData = [new NArray([1, 2, 3])];

    const myDataset = new dataset.Dataset(myData);

    expect(myDataset.get(0).real).toStrictEqual(myData[0].real);
    expect(myDataset.length).toBe(myData.length);

    const newData = [new NArray([1, 1, 1])];
    const otherDataset = await dataset.Dataset.from(newData);
    otherDataset.onGet = () => {
      return newData[0];
    };

    expect(otherDataset.get(0).real).toStrictEqual(newData[0].real);
    expect(myDataset.toArray()).toStrictEqual(myData);
    expect(myDataset.slice(0).get(0).real).toStrictEqual(
      myData[0].real.slice(0),
    );
  });

  test("Create dataset from url", async () => {
    const myDataset = await dataset.Dataset.from(
      "https://example.com/test.csv",
      {
        delimiter: ",",
        headerCol: 1,
      },
    );

    try {
      await dataset.Dataset.from("ftp://example.com/test.csv");
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    try {
      await dataset.Dataset.from("https://example.com/test1.csv");
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    expect(myDataset.get(0).real).toStrictEqual(expectedData[0].real);
    expect(myDataset.length).toBe(expectedData.length);

    myDataset.onGet = (element) => {
      const temp = element
        .flatten()
        .map((e) => (typeof e === "number" ? e + 1 : e));
      return new NArray(temp);
    };

    expect(myDataset.get(0).real).toStrictEqual(
      expectedData[0].map((e: number) => e + 1).real,
    );

    myDataset.onGet = (element) => element;
    expect(myDataset.toArray()).toStrictEqual(expectedData);
    expect(myDataset.slice(0).get(0).real).toStrictEqual(
      expectedData[0].real.slice(0),
    );
  });

  test("Create dataset from file", async () => {
    const myDataset = await dataset.Dataset.from("./test.csv", {
      delimiter: ",",
      headerCol: 1,
    });

    try {
      await dataset.Dataset.from("./test1.csv");
      expect(true).toBe(false);
    } catch (_) {
      expect(true).toBe(true);
    }

    expect(myDataset.get(0).real).toStrictEqual(expectedData[0].real);
    expect(myDataset.length).toBe(expectedData.length);

    myDataset.onGet = (element) => {
      const temp = element
        .flatten()
        .map((e) => (typeof e === "number" ? e + 1 : e));
      return new NArray(temp);
    };

    expect(myDataset.get(0).real).toStrictEqual(
      expectedData[0].map((e: number) => e + 1).real,
    );

    myDataset.onGet = (element) => element;
    expect(myDataset.toArray()).toStrictEqual(expectedData);
    expect(myDataset.slice(0).get(0).real).toStrictEqual(
      expectedData[0].real.slice(0),
    );
  });
});
