import NArray from '@/narray';
import readline from 'readline';
import fs from 'fs';
import cache from '@/utils/cache';
import { URL } from 'url';

import type { DatasetOptions } from './types';
import type { Element } from '@/narray/types';

export default class Dataset {
    #length: number;
    #data: Array<Element>;
    constructor(array: Array<NArray>) {
        this.#data = array;
        this.#length = array.length;
    }

    onGet(element: NArray): NArray {
        return element;
    }

    get(index: number): NArray {
        const data = this.#data.at(index);
        return this.onGet(new NArray(data));
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
        return this.#length;
    }

    toArray(): Array<NArray> {
        const final: Array<NArray> = [];
        for (let i = 0; i < this.length; i++) {
            final.push(this.get(i));
        }

        return final;
    }

    static async from(
        loc: string | Array<NArray>,
        options: DatasetOptions = {
            delimiter: ',',
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
                const parsedLine = line.split(options.delimiter);
                const finalParsedLine = parsedLine.map((e) => {
                    const temp = parseFloat(e);

                    if (!Number.isNaN(temp)) return temp;
                    return e;
                });

                return new NArray(finalParsedLine);
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
            // check if contents are cached
            const temp = cache.load(loc);
            if (temp) {
                loc = temp;
                isURL = false;
            } else {
                // check if the protocol is supported
                const supportedProtocols = ['http', 'https'];

                const urlProtocol = url.protocol.slice(0, -1);

                if (supportedProtocols.includes(urlProtocol)) {
                    data = await fetch(loc);

                    if (!data.ok) {
                        throw Error(`HTTP Request Failed: ${data.status}`);
                    }

                    data = await data.text();

                    // cache contents
                    cache.save(loc, data);

                    final = data
                        .split(/[\r\n]/)
                        .filter((e) => e)
                        .slice(options.headerCol)
                        .map(parseLine);
                } else {
                    isURL = false;
                }
            }
        }
        if (!isURL) {
            // loc might be a file path
            const fileStream = fs.createReadStream(loc, {
                flags: 'r',
                encoding: 'utf-8',
            });

            const file = readline.createInterface({
                input: fileStream,
            });
            let lineNo = 0;
            for await (const line of file) {
                if (++lineNo <= options.headerCol) {
                    continue;
                }
                final.push(parseLine(line));
            }
        }

        return new Dataset(final);
    }
}
