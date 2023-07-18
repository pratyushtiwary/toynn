import fs from "fs";
import NArray from "../narray";

export interface DatasetInput {
  path?: string;
  array?: Array<NArray>;
  delimiter?: string;
  headerRow?: number;
}

export class Dataset {
  #length: number;
  #data: Array<any>;
  #delim: string;
  #usedArray: boolean = false;

  constructor({
    path = undefined,
    array = undefined,
    delimiter = ",",
    headerRow = 1,
  }: DatasetInput) {
    if (!path && !array) {
      throw Error(
        `Failed to create dataset. Please provide either a path or an array of NArray`
      );
    }

    if (path) {
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
    if (array) {
      this.#data = array;
      this.#usedArray = true;
    }
    this.#delim = delimiter;
    this.#length = this.#data.length;
  }

  get(index: number): NArray {
    if (this.#usedArray) {
      return this.#data[index];
    } else {
      let data = this.#data[index].split(this.#delim);
      data = "[" + data.join(",") + "]";
      data = data.replace(/\'/g, '"');
      data = JSON.parse(data);
      return new NArray(data);
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

    return new Dataset({ array: final });
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

  get(index: number): NArray {
    return this.#dataset.get(this.#arrangement[index]);
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

    return new Dataset({ array: final });
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
