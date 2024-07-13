import Dataset from "@/dataset";
import NArray from "@/narray";

export default class DatasetSlice {
  #arrangement: Array<number>;
  #dataset: Dataset | DatasetSlice;

  constructor(dataset: Dataset | DatasetSlice, arrangement: Array<number>) {
    this.#dataset = dataset;
    this.#arrangement = arrangement;
  }

  onGet(element: NArray): NArray {
    return element;
  }

  get(index: number): NArray {
    return this.onGet(this.#dataset.get(this.#arrangement[index]));
  }

  slice(...selection: Array<number>): Dataset {
    const final = [];

    for (let i = 0; i < this.length; i++) {
      final.push(
        new NArray(
          this.get(i)
            .flatten()
            .slice(...selection)
        )
      );
    }

    return new Dataset(final);
  }

  get length() {
    return this.#arrangement.length;
  }

  toArray(): Array<NArray> {
    const final: Array<NArray> = [];
    for (let i = 0; i < this.length; i++) {
      final.push(this.get(i));
    }

    return final;
  }
}
