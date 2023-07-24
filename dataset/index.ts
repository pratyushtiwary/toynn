import fs from "fs";
import { URL } from "url";
import readline from "readline";
import os from "os";
import NArray from "../narray";
import path from "path";
import { randomUUID } from "crypto";

const DAYS = 86400000;

export interface DatasetOptions {
  delimiter?: string;
  headerCol?: number;
}

export class Dataset {
  #length: number;
  #data: Array<any>;
  constructor(array: Array<NArray>) {
    this.#data = array;
    this.#length = array.length;
  }

  onGet(element: NArray): NArray {
    return element;
  }

  get(index: number): NArray {
    let data = this.#data[index];
    return this.onGet(new NArray(data));
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

  static async from(
    loc: string | Array<NArray>,
    options: DatasetOptions = {
      delimiter: ",",
      headerCol: 1,
    }
  ) {
    if (loc instanceof Array) {
      return new Dataset(loc);
    }

    let data: Response | string | string[];
    let final: Array<NArray> = [];
    let isURL: boolean = false;

    function parseLine(line: string): NArray {
      try {
        let parsedLine = line.split(options.delimiter).join(",");
        parsedLine = "[" + parsedLine + "]";

        let finalParsedLine = JSON.parse(parsedLine);

        return finalParsedLine;
      } catch (_) {
        return new NArray(line.split(options.delimiter));
      }
    }

    // check if loc is a url
    let url: URL;
    try {
      url = new URL(loc);

      isURL = true;
    } catch (err) {
      isURL = false;
    }
    if (isURL) {
      // check if the protocol is supported
      const supportedProtocols = ["http", "https"];

      const urlProtocol = url.protocol.slice(0, -1);

      if (supportedProtocols.includes(urlProtocol)) {
        // create cache registry
        let cachePath = path.join(os.tmpdir(), "toynn-cache");
        let registryPath = path.join(cachePath, "registry.json");
        let registry = {};
        let filename = randomUUID().split("-").join("");
        let cachedFile = undefined;
        filename += "." + loc.split(".").at(-1);

        if (!fs.existsSync(cachePath)) {
          fs.mkdirSync(cachePath);
        }

        // sync registry
        try {
          if (fs.existsSync(registryPath)) {
            registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
          } else {
            fs.writeFileSync(registryPath, JSON.stringify(registry), "utf-8");
          }
        } catch (err) {
          fs.rmSync(registryPath);
        }

        // check if file is cached
        if (registry[loc]) {
          cachedFile = registry[loc];
        }

        if (cachedFile) {
          let cachedAt = new Date(cachedFile.cachedAt).getTime();

          if (cachedAt + DAYS * 7 > Date.now()) {
            loc = path.join(cachePath, cachedFile.name);
            isURL = false;
          } else {
            // expire cache
            delete registry[loc];
            fs.rmSync(path.join(cachePath, cachedFile.name));

            cachedFile = undefined;
          }
        }
        if (!cachedFile) {
          data = await fetch(loc);

          if (!data.ok) {
            throw Error(`HTTP Request Failed: ${data.status}`);
          }

          data = await data.text();

          final = data
            .split(/[\r\n]/)
            .filter((e) => e)
            .map(parseLine);

          // cache file
          let contents = {
            name: filename,
            cachedAt: new Date().toISOString(),
          };

          fs.writeFileSync(path.join(cachePath, filename), data, "utf-8");

          registry[loc] = contents;

          // save registry
          fs.writeFileSync(registryPath, JSON.stringify(registry), "utf-8");
        }
      } else {
        isURL = false;
      }
    }
    if (!isURL) {
      // loc might be a file path
      const fileStream = fs.createReadStream(loc, {
        flags: "r",
        encoding: "utf-8",
      });

      const file = readline.createInterface({
        input: fileStream,
      });
      let lineNo = 1;
      for await (const line of file) {
        if (lineNo <= options.headerCol) {
          lineNo++;
          continue;
        }
        final.push(parseLine(line));
      }
    }

    return new Dataset(final);
  }

  static flush() {
    let cachePath = path.join(os.tmpdir(), "toynn-cache");

    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, {
        recursive: true,
        force: true,
      });
    }
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
