"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Dataset_length, _Dataset_data, _Dataset_delim, _Dataset_usedArray, _DatasetSlice_arrangement, _DatasetSlice_dataset;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetSlice = exports.Dataset = void 0;
const fs_1 = __importDefault(require("fs"));
const narray_1 = __importDefault(require("../narray"));
class Dataset {
    constructor({ path = undefined, array = undefined, delimiter = ",", headerRow = 1, }) {
        _Dataset_length.set(this, void 0);
        _Dataset_data.set(this, void 0);
        _Dataset_delim.set(this, void 0);
        _Dataset_usedArray.set(this, false);
        if (!path && !array) {
            throw Error(`Failed to create dataset. Please provide either a path or an array of NArray`);
        }
        if (path) {
            __classPrivateFieldSet(this, _Dataset_data, fs_1.default.readFileSync(path, "utf-8").split("\r\n"), "f");
            __classPrivateFieldSet(this, _Dataset_data, [
                ...__classPrivateFieldGet(this, _Dataset_data, "f").slice(0, headerRow - 1),
                ...__classPrivateFieldGet(this, _Dataset_data, "f").slice(headerRow),
            ], "f");
            // check if last line is left blank
            if (__classPrivateFieldGet(this, _Dataset_data, "f").at(-1) === "") {
                __classPrivateFieldSet(this, _Dataset_data, __classPrivateFieldGet(this, _Dataset_data, "f").slice(0, -1), "f");
            }
        }
        if (array) {
            __classPrivateFieldSet(this, _Dataset_data, array, "f");
            __classPrivateFieldSet(this, _Dataset_usedArray, true, "f");
        }
        __classPrivateFieldSet(this, _Dataset_delim, delimiter, "f");
        __classPrivateFieldSet(this, _Dataset_length, __classPrivateFieldGet(this, _Dataset_data, "f").length, "f");
    }
    get(index) {
        if (__classPrivateFieldGet(this, _Dataset_usedArray, "f")) {
            return __classPrivateFieldGet(this, _Dataset_data, "f")[index];
        }
        else {
            let data = __classPrivateFieldGet(this, _Dataset_data, "f")[index].split(__classPrivateFieldGet(this, _Dataset_delim, "f"));
            data = "[" + data.join(",") + "]";
            data = data.replace(/\'/g, '"');
            data = JSON.parse(data);
            return new narray_1.default(data);
        }
    }
    slice(...selection) {
        let final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(new narray_1.default(this.get(i)
                .flatten()
                .slice(...selection)));
        }
        return new Dataset({ array: final });
    }
    get length() {
        return __classPrivateFieldGet(this, _Dataset_length, "f");
    }
    toArray() {
        let final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(this.get(i));
        }
        return final;
    }
}
exports.Dataset = Dataset;
_Dataset_length = new WeakMap(), _Dataset_data = new WeakMap(), _Dataset_delim = new WeakMap(), _Dataset_usedArray = new WeakMap();
class DatasetSlice {
    constructor(dataset, arrangement) {
        _DatasetSlice_arrangement.set(this, void 0);
        _DatasetSlice_dataset.set(this, void 0);
        __classPrivateFieldSet(this, _DatasetSlice_dataset, dataset, "f");
        __classPrivateFieldSet(this, _DatasetSlice_arrangement, arrangement, "f");
    }
    get(index) {
        return __classPrivateFieldGet(this, _DatasetSlice_dataset, "f").get(__classPrivateFieldGet(this, _DatasetSlice_arrangement, "f")[index]);
    }
    slice(...selection) {
        let final = [];
        for (let i = 0; i < this.length; i++) {
            final.push(new narray_1.default(this.get(i)
                .flatten()
                .slice(...selection)));
        }
        return new Dataset({ array: final });
    }
    get length() {
        return __classPrivateFieldGet(this, _DatasetSlice_arrangement, "f").length;
    }
    toArray() {
        let final = [];
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
//# sourceMappingURL=index.js.map