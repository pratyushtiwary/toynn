import { Dataset, DatasetSlice } from "../../dataset";
import NArray from "../../narray";

test("DatasetSlice test", () => {
  const data = [
    new NArray([1, 2, 3]),
    new NArray([4, 5, 6]),
    new NArray([7, 8, 9]),
  ];

  const dataset = new Dataset(data);

  const arrangement = [1, 0, 2];

  const datasetSlice = new DatasetSlice(dataset, arrangement);

  expect(datasetSlice.get(0).real).toStrictEqual(data[1].real);
  expect(datasetSlice.get(1).real).toStrictEqual(data[0].real);
  expect(datasetSlice.get(2).real).toStrictEqual(data[2].real);

  const slice = datasetSlice.slice(0);

  expect(slice.toArray()).toStrictEqual([data[1], data[0], data[2]]);

  const datasetSlice2 = new DatasetSlice(dataset, [0, 2]);

  expect(datasetSlice2.length).toBe(2);

  expect(datasetSlice2.toArray()).toStrictEqual([data[0], data[2]]);

  datasetSlice2.onGet = (element) => {
    return element.map((e: number) => e + 1);
  };

  expect(datasetSlice2.toArray()).toStrictEqual([
    data[0].map((e: number) => e + 1),
    data[2].map((e: number) => e + 1),
  ]);
});
