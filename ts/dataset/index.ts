import fs from "fs";
import NArray from "../narray";

export interface DatasetOptions {
  delimiter?: string;
  headerRow?: number;
}

export class Dataset {
  #length: number;
  #data: Array<any>;
  #delim: string;
  #usedArray: boolean = false;

  constructor(
    path: string | Array<NArray>,
    { delimiter = ",", headerRow = 1 }: DatasetOptions = {}
  ) {
    if (!path) {
      throw Error(
        `Failed to create dataset. Please provide a path or an array of NArray`
      );
    }

    if (typeof path === "string") {
      this.#data = fs.readFileSync(path, "utf-8").split("\r\n");
      this.#data = [
        ...this.#data.slice(0, headerRow - 1),
        ...this.#data.slice(headerRow),
      ];
      // check if last line is left blank
      if (this.#data.at(-1) === "") {
        this.#data = this.#data.slice(0, -1);
      }
    }
    if (path instanceof Array) {
      this.#data = path;
      this.#usedArray = true;
    }
    this.#delim = delimiter;
    this.#length = this.#data.length;
  }

  onGet(element: NArray): NArray {
    return element;
  }

  get(index: number): NArray {
    if (this.#usedArray) {
      return this.onGet(this.#data[index]);
    } else {
      let data = this.#data[index].split(this.#delim);
      data = "[" + data.join(",") + "]";
      data = data.replace(/\'/g, '"');
      data = JSON.parse(data);
      return this.onGet(new NArray(data));
    }
  }

  slice(...selection: Array<number>): Dataset {
    let final = [];

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
    return this.#length;
  }

  toArray(): Array<NArray> {
    let final: Array<NArray> = [];
    for (let i = 0; i < this.length; i++) {
      final.push(this.get(i));
    }

    return final;
  }
}

export class DatasetSlice {
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
    let final = [];

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
    let final: Array<NArray> = [];
    for (let i = 0; i < this.length; i++) {
      final.push(this.get(i));
    }

    return final;
  }
}

export default {
  Dataset,
  DatasetSlice,
};
