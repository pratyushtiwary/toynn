"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Dataset_length, _Dataset_data, _DatasetSlice_arrangement, _DatasetSlice_dataset;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetSlice = exports.Dataset = void 0;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const url_1 = require("url");
const narray_1 = __importDefault(require("../narray"));
const cache_1 = __importDefault(require("../utils/cache"));
class Dataset {
    constructor(array) {
        _Dataset_length.set(this, void 0);
        _Dataset_data.set(this, void 0);
        __classPrivateFieldSet(this, _Dataset_data, array, "f");
        __classPrivateFieldSet(this, _Dataset_length, array.length, "f");
    }
    onGet(element) {
        return element;
    }
    get(index) {
        const data = __classPrivateFieldGet(this, _Dataset_data, "f").at(index);
        return this.onGet(new narray_1.default(data));
    }
    slice(...selection) {
        const final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(new narray_1.default(this.get(i)
                .flatten()
                .slice(...selection)));
        }
        return new Dataset(final);
    }
    get length() {
        return __classPrivateFieldGet(this, _Dataset_length, "f");
    }
    toArray() {
        const final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(this.get(i));
        }
        return final;
    }
    static from(loc_1) {
        return __awaiter(this, arguments, void 0, function* (loc, options = {
            delimiter: ",",
            headerCol: 1,
        }) {
            var _a, e_1, _b, _c;
            if (loc instanceof Array) {
                return new Dataset(loc);
            }
            let data;
            let final = [];
            let isURL = false;
            function parseLine(line) {
                try {
                    const parsedLine = line.split(options.delimiter);
                    const finalParsedLine = parsedLine.map((e) => {
                        const temp = parseFloat(e);
                        if (!Number.isNaN(temp))
                            return temp;
                        return e;
                    });
                    return new narray_1.default(finalParsedLine);
                }
                catch (_) {
                    return new narray_1.default(line.split(options.delimiter));
                }
            }
            // check if loc is a url
            let url;
            try {
                url = new url_1.URL(loc);
                isURL = true;
            }
            catch (err) {
                isURL = false;
            }
            if (isURL) {
                // check if contents are cached
                const temp = cache_1.default.load(loc);
                if (temp) {
                    loc = temp;
                    isURL = false;
                }
                else {
                    // check if the protocol is supported
                    const supportedProtocols = ["http", "https"];
                    const urlProtocol = url.protocol.slice(0, -1);
                    if (supportedProtocols.includes(urlProtocol)) {
                        data = yield fetch(loc);
                        if (!data.ok) {
                            throw Error(`HTTP Request Failed: ${data.status}`);
                        }
                        data = yield data.text();
                        // cache contents
                        cache_1.default.save(loc, data);
                        final = data
                            .split(/[\r\n]/)
                            .filter((e) => e)
                            .slice(options.headerCol)
                            .map(parseLine);
                    }
                    else {
                        isURL = false;
                    }
                }
            }
            if (!isURL) {
                // loc might be a file path
                const fileStream = fs_1.default.createReadStream(loc, {
                    flags: "r",
                    encoding: "utf-8",
                });
                const file = readline_1.default.createInterface({
                    input: fileStream,
                });
                let lineNo = 0;
                try {
                    for (var _d = true, file_1 = __asyncValues(file), file_1_1; file_1_1 = yield file_1.next(), _a = file_1_1.done, !_a; _d = true) {
                        _c = file_1_1.value;
                        _d = false;
                        const line = _c;
                        if (++lineNo <= options.headerCol) {
                            continue;
                        }
                        final.push(parseLine(line));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = file_1.return)) yield _b.call(file_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return new Dataset(final);
        });
    }
}
exports.Dataset = Dataset;
_Dataset_length = new WeakMap(), _Dataset_data = new WeakMap();
class DatasetSlice {
    constructor(dataset, arrangement) {
        _DatasetSlice_arrangement.set(this, void 0);
        _DatasetSlice_dataset.set(this, void 0);
        __classPrivateFieldSet(this, _DatasetSlice_dataset, dataset, "f");
        __classPrivateFieldSet(this, _DatasetSlice_arrangement, arrangement, "f");
    }
    onGet(element) {
        return element;
    }
    get(index) {
        return this.onGet(__classPrivateFieldGet(this, _DatasetSlice_dataset, "f").get(__classPrivateFieldGet(this, _DatasetSlice_arrangement, "f")[index]));
    }
    slice(...selection) {
        const final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(new narray_1.default(this.get(i)
                .flatten()
                .slice(...selection)));
        }
        return new Dataset(final);
    }
    get length() {
        return __classPrivateFieldGet(this, _DatasetSlice_arrangement, "f").length;
    }
    toArray() {
        const final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(this.get(i));
        }
        return final;
    }
}
exports.DatasetSlice = DatasetSlice;
_DatasetSlice_arrangement = new WeakMap(), _DatasetSlice_dataset = new WeakMap();
exports.default = {
    Dataset,
    DatasetSlice,
};
