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
var _NArray_instances, _NArray_arr, _NArray_computedShape, _NArray_length, _NArray_computedStrides, _NArray_ndim, _NArray_computeShape, _NArray_computeStrides, _NArray_get, _NArray_flatten;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
class NArray {
    constructor(obj) {
        /**
         * Numerical Array implementation which allows user to perform advance computational stuff
         * @param obj:<Array, NArray>
         */
        _NArray_instances.add(this);
        _NArray_arr.set(this, []);
        _NArray_computedShape.set(this, undefined);
        _NArray_length.set(this, undefined);
        _NArray_computedStrides.set(this, undefined);
        _NArray_ndim.set(this, undefined);
        this.printThreshold = 5;
        if (obj instanceof Array) {
            __classPrivateFieldSet(this, _NArray_arr, obj, "f");
            __classPrivateFieldSet(this, _NArray_arr, Array.from(__classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            __classPrivateFieldSet(this, _NArray_computedShape, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeShape).call(this, __classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            __classPrivateFieldSet(this, _NArray_computedStrides, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeStrides).call(this, ...__classPrivateFieldGet(this, _NArray_computedShape, "f")), "f");
            __classPrivateFieldSet(this, _NArray_ndim, __classPrivateFieldGet(this, _NArray_computedShape, "f").length, "f");
            // flatten the array after computing shape
            __classPrivateFieldSet(this, _NArray_arr, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_flatten).call(this, __classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            if (this.length !== NArray.calcNoOfElems(...__classPrivateFieldGet(this, _NArray_computedShape, "f"))) {
                throw Error(`The passed array doesn't seems to follow a fixed shape. NArray's need to have a fixed shape.
          
          How to fix this?
          
          Make sure the number of elements in your array(${this.length}) is equals to the product of ${__classPrivateFieldGet(this, _NArray_computedShape, "f")}
          `);
            }
        }
        else if (obj instanceof NArray) {
            __classPrivateFieldSet(this, _NArray_arr, obj.flatten(), "f");
            __classPrivateFieldSet(this, _NArray_computedShape, obj.shape, "f");
            __classPrivateFieldSet(this, _NArray_computedStrides, obj.strides, "f");
            __classPrivateFieldSet(this, _NArray_ndim, obj.ndim, "f");
        }
        else {
            throw Error(`Unsupported object type.
      
      How to fix this?

      Looks like you've tried converting ${typeof obj} to an NArray.
      NArray only supports Array and NArray to be converted into NArray.
      Try converting your object to array.
      `);
        }
    }
    static calcNoOfElems(...shape) {
        /**
         * Calculate number of elements in an array by summing up the shape
         * @param shape: Array -> shape of the array
         */
        let noOfElems = 1;
        utils_1.default.loop({
            start: 0,
            end: shape.length,
            func: (i) => {
                noOfElems *= shape[i];
            },
        });
        return noOfElems;
    }
    get shape() {
        return __classPrivateFieldGet(this, _NArray_computedShape, "f");
    }
    get strides() {
        return __classPrivateFieldGet(this, _NArray_computedStrides, "f");
    }
    get length() {
        if (!__classPrivateFieldGet(this, _NArray_length, "f")) {
            __classPrivateFieldSet(this, _NArray_length, __classPrivateFieldGet(this, _NArray_arr, "f").length, "f");
        }
        return __classPrivateFieldGet(this, _NArray_length, "f");
    }
    get ndim() {
        return __classPrivateFieldGet(this, _NArray_ndim, "f");
    }
    set strides(newStrides) {
        if (!(newStrides instanceof Array)) {
            throw Error(`Failed to change stride
      
      How to fix this?
      Try chaning the newStrides passed into an array.`);
        }
        else if (newStrides.length !== this.shape.length) {
            throw Error(`strides must be same length as shape (${this.shape.length})
        
        How to fix this?
        Make sure new strides have ${this.ndim} number of elements.`);
        }
        __classPrivateFieldSet(this, _NArray_computedStrides, newStrides, "f");
    }
    flatten() {
        /**
         * Returns flat Array
         */
        return __classPrivateFieldGet(this, _NArray_arr, "f");
    }
    reduce(func) {
        let f = __classPrivateFieldGet(this, _NArray_arr, "f").reduce((a, b) => func(a, b));
        return f;
    }
    map(func) {
        let f = __classPrivateFieldGet(this, _NArray_arr, "f").map((e, i) => func(e, i));
        return new NArray(f);
    }
    forEach(func) {
        __classPrivateFieldGet(this, _NArray_arr, "f").forEach((e, i) => func(e, i));
    }
    max() {
        let maxIndex = 0, maxElem = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
        utils_1.default.loop({
            end: this.length,
            func: (i) => {
                if (__classPrivateFieldGet(this, _NArray_arr, "f")[i] > maxElem) {
                    maxIndex = i;
                    maxElem = __classPrivateFieldGet(this, _NArray_arr, "f")[i];
                }
            },
        });
        return { index: maxIndex, element: maxElem };
    }
    sum(axis = undefined) {
        if (axis > this.ndim - 1 || axis < 0) {
            throw Error(`Axis out of bound
      
      How to fix this?
      Try changing axis to a number between 0 and ${this.ndim - 1}.`);
        }
        if (axis === undefined) {
            return new NArray([this.reduce((a, b) => a + b)]);
        }
        const inc = this.strides[axis], breakage = this.shape[axis], prevBreakage = this.strides[axis - 1];
        let final = [], temp = 0, i = 0, j = 0;
        utils_1.default.loop({
            end: this.length,
            func: (o) => {
                temp += __classPrivateFieldGet(this, _NArray_arr, "f")[j];
                j += inc;
                if ((o + 1) % breakage === 0) {
                    final.push(temp);
                    temp = 0;
                    if (axis === 0) {
                        i++;
                    }
                    else if (axis > 0 && axis < this.ndim - 1) {
                        if ((o + 1) % prevBreakage === 0) {
                            i = o + breakage - 1;
                        }
                        else {
                            i++;
                        }
                    }
                    else {
                        i += breakage;
                    }
                    j = i;
                }
            },
        });
        let newShape;
        if (axis < this.ndim - 1) {
            newShape = this.shape.slice(1);
        }
        else {
            newShape = this.shape.slice(0, -1);
        }
        return new NArray(final).reshape(...newShape);
    }
    diag() {
        if (this.ndim > 2) {
            throw Error(`NArray should be either 1d or 2d
      
      How to fix this?
      Try reshaping your NArray to convert it into 1d or 2d NArray.`);
        }
        if (this.ndim === 1) {
            let final = [], j = 0, k = 0;
            final[0] = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            utils_1.default.loop({
                start: 1,
                end: this.length * this.length,
                func: (i) => {
                    if (i % (this.length * j + j) === 0) {
                        final.push(__classPrivateFieldGet(this, _NArray_arr, "f")[j]);
                    }
                    else {
                        final.push(0);
                    }
                    if ((i + 1) % this.length === 0) {
                        j++;
                    }
                },
            });
            return new NArray(final).reshape(this.length, this.length);
        }
        else if (this.ndim === 2) {
            let smaller = this.shape[0] < this.shape[1] ? this.shape[0] : this.shape[1];
            let final = [];
            final[0] = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            utils_1.default.loop({
                start: 1,
                end: smaller,
                func: (i) => {
                    final[i] = __classPrivateFieldGet(this, _NArray_arr, "f")[this.shape[1] * i + i];
                },
            });
            return new NArray(final);
        }
    }
    add(y) {
        let final = [], r;
        if (typeof y === "number") {
            final = this.map((e) => e + y);
        }
        else {
            if (!(y instanceof NArray)) {
                throw Error(`Failed to add because the passed object is not NArray

        How to fix this?
        Try converting the passed object to NArray.
        `);
            }
            r = y.flatten();
            final = this.map((e, i) => e + r[i % y.length]);
        }
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    sub(y) {
        let final = [], r;
        if (typeof y === "number") {
            final = this.map((e) => e - y);
        }
        else {
            if (!(y instanceof NArray)) {
                throw Error(`Failed to subtract because the passed object is not NArray
          
          How to fix this?
          Try converting the passed object to NArray.`);
            }
            r = y.flatten();
            final = this.map((e, i) => e - r[i % y.length]);
        }
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    div(y) {
        let final = [], r;
        if (typeof y === "number") {
            return this.map((e) => e / y);
        }
        else {
            if (!(y instanceof NArray)) {
                throw Error(`Failed to divide because the passed object is not NArray
        
        How to fix this?
        Try converting the passed object to NArray.`);
            }
            r = y.flatten();
            final = this.map((e, i) => e / r[i % y.length]);
        }
        final = new NArray(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    mul(y) {
        let final = [], r, temp;
        if (typeof y === "number") {
            temp = y;
            final = this.map((e) => e * temp);
        }
        else if (y instanceof NArray && y.length === 1) {
            temp = y.flatten()[0];
            final = this.map((e) => e * temp);
        }
        else if (this.length === 1) {
            temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => e * temp);
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof NArray)) {
                throw Error(`Failed to multiply because the passed object is not NArray
          
          How to fix this?
          Try converting the passed object to NArray.`);
            }
            if (y.shape[y.shape.length - 1] !== this.shape[this.shape.length - 1]) {
                throw Error(`Shapes are not aligned. Failed to multiply.
        
        How to fix this?
        Make sure the passed NArray object is of ${this.ndim} dimension and ${this.ndim - 1} dimension is equals to ${this.shape[this.shape.length - 1]}`);
            }
            r = y.flatten();
            final = this.map((e, i) => e * r[i % y.length]);
        }
        final = new NArray(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    pow(y) {
        let final = [], r;
        if (typeof y === "number") {
            final = this.map((e) => Math.pow(e, y));
        }
        else {
            if (!(y instanceof NArray)) {
                throw Error(`Failed to pow because the passed object is not NArray
        
        How to fix this?
        Try converting the passed object to NArray.`);
            }
            r = y.flatten();
            final = this.map((e, i) => Math.pow(e, r[i % y.length]));
        }
        final = new NArray(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    dot(y) {
        if (!(y instanceof NArray)) {
            throw Error(`Failed to dot because the passed object is not NArray
      
      How to fix this?
      Try converting the passed object to NArray.`);
        }
        if (this.ndim === 1 && y.ndim === 1) {
            return this.mul(y).sum();
        }
        if (y.ndim === 1 || this.ndim === 1) {
            if (this.shape[this.shape.length - 1] !== y.shape[y.shape.length - 1]) {
                throw Error(`Shapes are not aligned. Failed to dot
        
        How to fix this?
        Make sure ${y.ndim - 1} dimension(${y.shape[y.shape.length - 1]}) is equal to ${this.ndim - 1} dimension(${this.shape[this.shape.length - 1]})`);
            }
            return this.mul(y);
        }
        const shape1 = this.shape, shape2 = y.shape;
        if (this.ndim !== y.ndim) {
            throw Error(`Passed NArray is not of same dimension.
      
      How to fix this?
      Reshape the passed NArray to ${this.ndim} dimension`);
        }
        if (this.ndim === 2) {
            if (shape1[1] !== shape2[0]) {
                throw Error(`Shapes ${shape1} and ${shape2} are not aligned. ${shape1[1]}(dim=1) != ${shape2[0]}(dim=0).
          
          How to fix this?
          Reshape your passed array with dimension 0 as ${shape1[1]}`);
            }
        }
        if (this.ndim > 2 || y.ndim > 2) {
            if (shape1[shape1.length - 1] !== shape2[shape2.length - 2]) {
                throw Error(`Shapes ${shape1} and ${shape2} are not aligned. ${shape1[shape1.length - 1]}(dim=${this.ndim - 1}) != ${shape2[shape2.length - 2]}(dim=${y.ndim - 2})
          
          How to fix this?
          Reshape your passed array with dimension ${y.ndim - 2} as ${shape1[shape1.length - 1]}`);
            }
        }
        const newShape = [
            ...shape1.slice(0, -1),
            ...shape2.slice(0, shape2.length - 2),
            shape2[shape2.length - 1],
        ];
        let final = [], temp = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, arr2 = y.flatten(), length = y.length, tempShape1 = shape1.filter((e) => e !== 1), tempShape2 = shape2.filter((e) => e !== 1), breakage = tempShape2[tempShape2.length - 1] * tempShape2[tempShape2.length - 2];
        if ((shape2[shape2.length - 1] === 1 && tempShape2.length === 1) ||
            (shape1[shape1.length - 1] === 1 && tempShape1.length === 1)) {
            tempShape1 = shape1;
            tempShape2 = shape2;
            breakage = tempShape2[tempShape2.length - 2];
        }
        if (this.length === 1 || y.length === 1) {
            tempShape1 = shape1;
            tempShape2 = shape2;
        }
        const shape1Last = tempShape1[tempShape1.length - 1], shape2Last = tempShape2[tempShape2.length - 1], newLen = NArray.calcNoOfElems(...newShape), iterCond = newLen * shape1Last;
        utils_1.default.loop({
            start: 0,
            end: iterCond,
            func: (o) => {
                temp += __classPrivateFieldGet(this, _NArray_arr, "f")[i] * arr2[l + k];
                i++;
                k += shape2Last;
                if ((j + 1) % shape2Last === 0 && (o + 1) % shape1Last === 0) {
                    if (l === 0) {
                        l = breakage;
                    }
                    else {
                        l += breakage;
                    }
                }
                if ((o + 1) % length === 0) {
                    n++;
                    m = shape1Last * n;
                    l = 0;
                    k = 0;
                }
                if ((o + 1) % shape1Last === 0) {
                    j++;
                    k = j % shape2Last;
                    i = m;
                    final.push(temp);
                    temp = 0;
                }
            },
        });
        return new NArray(final).reshape(...newShape);
    }
    transpose() {
        /**
         * Returns transpose of the NArray
         *
         * Reference: https://stackoverflow.com/a/32034565
         */
        const final = new NArray(__classPrivateFieldGet(this, _NArray_arr, "f"));
        final.reshape(...Array.from(this.shape).reverse());
        final.strides = Array.from(this.strides).reverse();
        return final;
    }
    reshape(...shape) {
        /**
         * Broadcast array into provided shape
         * @param dims: Array -> shape to broadcast array into
         */
        if (NArray.calcNoOfElems(...shape) !== this.length) {
            throw Error(`Array of dimension ${this.shape} can't be broadcasted into ${shape} dimension
        
        How to fix this?
        The passed shape(${shape}) product is not equal to ${this.length}, make sure that you pass the new shape whose product is equal to ${this.length}`);
        }
        __classPrivateFieldSet(this, _NArray_computedShape, shape, "f");
        this.strides = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeStrides).call(this, ...shape);
        __classPrivateFieldSet(this, _NArray_ndim, shape.length, "f");
        return this;
    }
    get T() {
        /**
         * Returns transpose of the NArray
         */
        return this.transpose();
    }
    get(...path) {
        /**
         * Allows to fetch values from specified index
         * @param path: Array -> index path
         *
         * Usage:
         *  k = NArray.arange(1,33).reshape(2,2,2,4);
         *  console.log(k.get(0,0));
         */
        let final = [];
        if (path.length === 0) {
            utils_1.default.loop({
                end: this.shape[0],
                func: (i) => {
                    final.push(__classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, i));
                },
            });
        }
        else {
            final = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, ...path);
        }
        return final;
    }
    get real() {
        return this.get();
    }
    jsonify() {
        /**
         * Returns jsonified string of the array
         *
         * Used for printing purposes
         */
        return JSON.stringify(this.real, null, 4);
    }
    toString() {
        if (this.length > this.printThreshold) {
            let finalStr = "";
            for (let i = 0; i < this.shape.length; i++) {
                finalStr += "[";
            }
            finalStr += __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            finalStr += "...";
            finalStr += __classPrivateFieldGet(this, _NArray_arr, "f")[this.length - 1];
            for (let i = 0; i < this.shape.length; i++) {
                finalStr += "]";
            }
            return finalStr;
        }
        return JSON.stringify(this.real);
    }
    valueOf() {
        return this.real;
    }
    static zeroes(...shape) {
        /**
         * Returns a provided dimension NArray with all of its values as 0
         * @param dims: Array -> shape of the new NArray
         */
        const temp = [];
        const elems = NArray.calcNoOfElems(...shape);
        utils_1.default.loop({
            end: elems,
            func: () => {
                temp.push(0);
            },
        });
        return new NArray(temp).reshape(...shape);
    }
    static arange(start = 1, end = undefined, step = 1) {
        /**
         * Returns a flat NArray with elements ranging from start -> end with specified step increment
         * @param start: int -> start of the range
         * @param end: int -> end of the range
         * @param step: int -> stride
         */
        if (!end) {
            end = start;
            start = 0;
        }
        if (end < start) {
            const temp = end;
            end = start;
            start = temp;
        }
        const values = [];
        utils_1.default.loop({
            end: end,
            start: start,
            func: (i) => {
                values.push(i);
            },
        });
        return new NArray(values);
    }
    static randn(mean = 0, stdev = 1) {
        /**
         * Returns random number as per normal distribution
         */
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z * stdev + mean;
    }
}
_NArray_arr = new WeakMap(), _NArray_computedShape = new WeakMap(), _NArray_length = new WeakMap(), _NArray_computedStrides = new WeakMap(), _NArray_ndim = new WeakMap(), _NArray_instances = new WeakSet(), _NArray_computeShape = function _NArray_computeShape(x) {
    /**
     * Recursively compute shape for provided array
     * @param x: Array
     */
    let size = [];
    if (x === null || x === void 0 ? void 0 : x.length) {
        size.push(x.length);
        size = [...size, ...__classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeShape).call(this, x[0])];
        return size;
    }
    else {
        return size;
    }
}, _NArray_computeStrides = function _NArray_computeStrides(...shape) {
    /**
     * Provided a shape it calculates number of strides
     * @param shape: Array
     */
    let final = [], temp;
    utils_1.default.loop({
        start: 1,
        end: shape.length + 1,
        func: (i) => {
            if (i === shape.length) {
                final.push(1);
            }
            else {
                temp = shape.slice(i);
                final.push(temp.reduce((a, b) => a * b));
            }
        },
    });
    return final;
}, _NArray_get = function _NArray_get(...path) {
    /**
     * Recusively gets value for the specified path
     *
     * Used by the get function
     */
    if (path.length <= this.strides.length) {
        if (path.length === this.strides.length) {
            let finalIndex = 0;
            path.forEach((e, i) => {
                finalIndex += e * this.strides[i];
            });
            return __classPrivateFieldGet(this, _NArray_arr, "f")[finalIndex];
        }
        else {
            let final = [], currShape = this.shape[path.length];
            if (path.length + 1 === this.strides.length) {
                currShape = this.shape[path.length];
            }
            utils_1.default.loop({
                start: 0,
                end: currShape,
                func: (i) => {
                    final[i] = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, ...path, i);
                },
            });
            return final;
        }
    }
    else {
        throw Error(`Range out of index.
      
      How to fix this?
      Your NArray is of dimension ${this.ndim} put you are trying to access ${path.length} dimension data. Try changing the path passed to ${this.ndim} dimension.`);
    }
}, _NArray_flatten = function _NArray_flatten(x = __classPrivateFieldGet(this, _NArray_arr, "f")) {
    var _a;
    /**
     * Recursively flattens passed array
     * @param x: Array -> defaults to value by which object is initialized
     */
    let final = [];
    let temp;
    if (!((_a = x[0]) === null || _a === void 0 ? void 0 : _a.length)) {
        return x;
    }
    else {
        x.forEach((e) => {
            if (e instanceof NArray) {
                temp = e.flatten();
            }
            else {
                temp = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_flatten).call(this, e);
            }
            final = [...final, ...temp];
        });
        return final;
    }
};
exports.default = NArray;
//# sourceMappingURL=index.js.map