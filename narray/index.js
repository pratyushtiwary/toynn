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
var _NArray_instances, _a, _NArray_arr, _NArray_computedShape, _NArray_length, _NArray_computedStrides, _NArray_ndim, _NArray_computeShape, _NArray_computeStrides, _NArray_get, _NArray_flatten;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NArray = void 0;
globalThis.NArray_printThreshold = 5;
class NArray {
    /**
     * Numerical Array implementation which allows user to perform advance computational stuff
     * @param obj {NArrayInput | NArray}
     */
    constructor(obj) {
        _NArray_instances.add(this);
        _NArray_arr.set(this, []);
        _NArray_computedShape.set(this, undefined);
        _NArray_length.set(this, undefined);
        _NArray_computedStrides.set(this, undefined);
        _NArray_ndim.set(this, undefined);
        if (obj instanceof Array) {
            __classPrivateFieldSet(this, _NArray_arr, obj, "f");
            __classPrivateFieldSet(this, _NArray_arr, Array.from(__classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            __classPrivateFieldSet(this, _NArray_computedShape, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeShape).call(this, __classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            __classPrivateFieldSet(this, _NArray_computedStrides, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeStrides).call(this, ...__classPrivateFieldGet(this, _NArray_computedShape, "f")), "f");
            __classPrivateFieldSet(this, _NArray_ndim, __classPrivateFieldGet(this, _NArray_computedShape, "f").length, "f");
            // flatten the array after computing shape
            __classPrivateFieldSet(this, _NArray_arr, __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_flatten).call(this, __classPrivateFieldGet(this, _NArray_arr, "f")), "f");
            if (this.length !== _a.calcNoOfElems(...__classPrivateFieldGet(this, _NArray_computedShape, "f"))) {
                throw Error(`The passed array doesn't seems to follow a fixed shape. NArray's need to have a fixed shape.

          How to fix this?

          Make sure the number of elements in your array(${this.length}) is equals to the product of ${__classPrivateFieldGet(this, _NArray_computedShape, "f")}
          `);
            }
        }
        else if (obj instanceof _a) {
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
    /**
     * Calculate number of elements in an array by summing up the shape
     * @param shape: Array -> shape of the array
     */
    static calcNoOfElems(...shape) {
        let noOfElems = 1;
        for (let i = 0; i < shape.length; i++) {
            noOfElems *= shape[i];
        }
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
    /**
     * Returns flat Array
     */
    flatten() {
        return __classPrivateFieldGet(this, _NArray_arr, "f");
    }
    reduce(func) {
        const f = __classPrivateFieldGet(this, _NArray_arr, "f").reduce((a, b) => func(a, b));
        return f;
    }
    map(func) {
        const f = __classPrivateFieldGet(this, _NArray_arr, "f").map((e, i) => func(e, i));
        return new _a(f).reshape(...this.shape);
    }
    forEach(func) {
        __classPrivateFieldGet(this, _NArray_arr, "f").forEach((e, i) => func(e, i));
    }
    max() {
        let maxIndex = 0, maxElem = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
        for (let i = 0; i < this.length; i++) {
            if (__classPrivateFieldGet(this, _NArray_arr, "f")[i] > maxElem) {
                maxIndex = i;
                maxElem = __classPrivateFieldGet(this, _NArray_arr, "f")[i];
            }
        }
        return { index: maxIndex, element: maxElem };
    }
    sum(axis = undefined) {
        if (axis > this.ndim - 1 || axis < 0) {
            throw Error(`Axis out of bound

      How to fix this?
      Try changing axis to a number between 0 and ${this.ndim - 1}.`);
        }
        if (axis === undefined) {
            return new _a([this.reduce((a, b) => a + b)]);
        }
        const inc = this.strides[axis], breakage = this.shape[axis], prevBreakage = this.strides[axis - 1];
        const final = [];
        let temp = 0, i = 0, j = 0;
        for (let o = 0; o < this.length; o++) {
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
        }
        let newShape;
        if (axis < this.ndim - 1) {
            newShape = [...this.shape.slice(0, axis), ...this.shape.slice(axis + 1)];
        }
        else {
            newShape = this.shape.slice(0, -1);
        }
        return new _a(final).reshape(...newShape);
    }
    diag() {
        if (this.ndim > 2) {
            throw Error(`NArray should be either 1d or 2d

      How to fix this?
      Try reshaping your NArray to convert it into 1d or 2d NArray.`);
        }
        if (this.ndim === 1) {
            const final = [];
            let j = 0;
            final[0] = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            for (let i = 1; i < this.length * this.length; i++) {
                if (i % (this.length * j + j) === 0) {
                    final.push(__classPrivateFieldGet(this, _NArray_arr, "f")[j]);
                }
                else {
                    final.push(0);
                }
                if ((i + 1) % this.length === 0) {
                    j++;
                }
            }
            return new _a(final).reshape(this.length, this.length);
        }
        else if (this.ndim === 2) {
            const smaller = this.shape[0] < this.shape[1] ? this.shape[0] : this.shape[1];
            const final = [];
            final[0] = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            for (let i = 1; i < smaller; i++) {
                final[i] = __classPrivateFieldGet(this, _NArray_arr, "f")[this.shape[1] * i + i];
            }
            return new _a(final);
        }
    }
    add(y) {
        let final = [], r;
        if (typeof y === "number") {
            const temp = y;
            final = this.map((e) => e + temp);
        }
        else if (y.length === 1) {
            const temp = y.flatten()[0];
            final = this.map((e) => e + temp);
        }
        else if (this.length === 1) {
            const temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => temp + e);
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof _a)) {
                throw Error(`Failed to add because the passed object is not NArray

        How to fix this?
        Try converting the passed object to NArray.
        `);
            }
            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to add.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();
            final = this.map((e, i) => e + r[i]);
        }
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    sub(y) {
        let final = [], r;
        if (typeof y === "number") {
            const temp = y;
            final = this.map((e) => e - temp);
        }
        else if (y.length === 1) {
            const temp = y.flatten()[0];
            final = this.map((e) => e - temp);
        }
        else if (this.length === 1) {
            const temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => temp - e);
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof _a)) {
                throw Error(`Failed to subtract because the passed object is not NArray

          How to fix this?
          Try converting the passed object to NArray.`);
            }
            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to subtract.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();
            final = this.map((e, i) => e - r[i]);
        }
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    div(y) {
        let final = [], r;
        if (typeof y === "number") {
            return this.map((e) => e / y);
        }
        else if (y.length === 1) {
            const temp = y.flatten()[0];
            final = this.map((e) => e / temp);
        }
        else if (this.length === 1) {
            const temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => temp / e);
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof _a)) {
                throw Error(`Failed to divide because the passed object is not NArray

        How to fix this?
        Try converting the passed object to NArray.`);
            }
            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to divide.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();
            final = this.map((e, i) => e / r[i]);
        }
        final = new _a(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    mul(y) {
        let final = [], r, temp;
        if (typeof y === "number") {
            temp = y;
            final = this.map((e) => e * temp);
        }
        else if (y instanceof _a && y.length === 1) {
            temp = y.flatten()[0];
            final = this.map((e) => e * temp);
        }
        else if (this.length === 1) {
            temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => e * temp);
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof _a)) {
                throw Error(`Failed to multiply because the passed object is not NArray

          How to fix this?
          Try converting the passed object to NArray.`);
            }
            if (y.shape[y.shape.length - 1] !== this.shape[this.shape.length - 1]) {
                throw Error(`Shapes are not aligned. Failed to multiply.

        How to fix this?
        Make sure the passed NArray object is of ${this.ndim} dimension and ${this.ndim - 1} dimension is equals to ${this.shape[this.shape.length - 1]}`);
            }
            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to multiply.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();
            final = this.map((e, i) => e * r[i]);
        }
        final = new _a(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    pow(y) {
        let final = [], r;
        if (typeof y === "number") {
            final = this.map((e) => Math.pow(e, y));
        }
        else if (y.length === 1) {
            const temp = y.flatten()[0];
            final = this.map((e) => Math.pow(e, temp));
        }
        else if (this.length === 1) {
            const temp = __classPrivateFieldGet(this, _NArray_arr, "f")[0];
            final = y.map((e) => Math.pow(temp, e));
            return final.reshape(...y.shape);
        }
        else {
            if (!(y instanceof _a)) {
                throw Error(`Failed to X^Y because the passed object is not NArray

        How to fix this?
        Try converting the passed object to NArray.`);
            }
            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to X^Y.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();
            final = this.map((e, i) => Math.pow(e, r[i]));
        }
        final = new _a(final);
        final.reshape(...__classPrivateFieldGet(this, _NArray_computedShape, "f"));
        return final;
    }
    dot(y) {
        if (!(y instanceof _a)) {
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
        const final = [];
        let temp = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, tempShape1 = shape1.filter((e) => e !== 1), tempShape2 = shape2.filter((e) => e !== 1), breakage = tempShape2[tempShape2.length - 1] * tempShape2[tempShape2.length - 2];
        const arr2 = y.flatten(), length = y.length;
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
        const shape1Last = tempShape1[tempShape1.length - 1], shape2Last = tempShape2[tempShape2.length - 1], newLen = _a.calcNoOfElems(...newShape), iterCond = newLen * shape1Last;
        for (let o = 0; o < iterCond; o++) {
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
        }
        return new _a(final).reshape(...newShape);
    }
    /**
     * Returns transpose of the NArray
     *
     * Reference: https://stackoverflow.com/a/32034565
     */
    transpose() {
        const final = new _a(__classPrivateFieldGet(this, _NArray_arr, "f"));
        final.reshape(...Array.from(this.shape).reverse());
        final.strides = Array.from(this.strides).reverse();
        return final;
    }
    /**
     * Broadcast array into provided shape
     * @param dims: Array -> shape to broadcast array into
     */
    reshape(...shape) {
        // check if there is any imaginary dimension(-1) given
        const imaginaryDimFound = shape.filter((e) => e === -1).length;
        const tempShape = shape.filter((e) => e !== -1);
        const newLen = _a.calcNoOfElems(...tempShape);
        if (imaginaryDimFound === 1) {
            let imaginaryDim = 0;
            imaginaryDim = this.length / newLen;
            shape = shape.map((e) => (e === -1 ? imaginaryDim : e));
        }
        else if (imaginaryDimFound > 1) {
            throw Error(`Failed to reshape, only single imaginary dimension is supported`);
        }
        if (_a.calcNoOfElems(...shape) !== this.length) {
            throw Error(`Array of dimension ${this.shape} can't be broadcasted into ${shape} dimension

        How to fix this?
        The passed shape(${shape}) product is not equal to ${this.length}, make sure that you pass the new shape whose product is equal to ${this.length}`);
        }
        __classPrivateFieldSet(this, _NArray_computedShape, shape, "f");
        this.strides = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeStrides).call(this, ...shape);
        __classPrivateFieldSet(this, _NArray_ndim, shape.length, "f");
        return this;
    }
    /**
     * Returns transpose of the NArray
     */
    get T() {
        return this.transpose();
    }
    /**
     * Allows to fetch values from specified index
     * @param path: Array -> index path
     *
     * Usage:
     *  k = NArray.arange(1,33).reshape(2,2,2,4);
     *  console.log(k.get(0,0));
     */
    get(...path) {
        let final = [];
        if (path.length === 0) {
            for (let i = 0; i < this.shape[0]; i++) {
                final.push(__classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, i));
            }
        }
        else {
            final = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, ...path);
        }
        return final;
    }
    get real() {
        return this.get();
    }
    /**
     * Returns jsonified string of the array
     *
     * Used for printing purposes
     */
    jsonify() {
        return JSON.stringify(this.real, null, 4);
    }
    toString() {
        if (this.length > globalThis.NArray_printThreshold) {
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
    /**
     * Returns a provided dimension NArray with all of its values as 0
     * @param dims: Array -> shape of the new NArray
     */
    static zeros(...shape) {
        const temp = [];
        const elems = _a.calcNoOfElems(...shape);
        for (let i = 0; i < elems; i++) {
            temp.push(0);
        }
        return new _a(temp).reshape(...shape);
    }
    /**
     * Returns a flat NArray with elements ranging from start -> end with specified step increment
     * @param start: int -> start of the range
     * @param end: int -> end of the range
     * @param step: int -> stride
     */
    static arange(start = 0, end = undefined, step = 1) {
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
        for (let i = start; i < end; i += step) {
            values.push(i);
        }
        return new _a(values);
    }
    /**
     * Returns random number as per normal distribution
     */
    static randn(mean = 0, stdev = 1) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z * stdev + mean;
    }
    static setPrintThreshold(n) {
        globalThis.NArray_printThreshold = n;
    }
}
exports.NArray = NArray;
_a = NArray, _NArray_arr = new WeakMap(), _NArray_computedShape = new WeakMap(), _NArray_length = new WeakMap(), _NArray_computedStrides = new WeakMap(), _NArray_ndim = new WeakMap(), _NArray_instances = new WeakSet(), _NArray_computeShape = function _NArray_computeShape(x) {
    let size = [];
    if (x instanceof Array) {
        size.push(x.length);
        size = [...size, ...__classPrivateFieldGet(this, _NArray_instances, "m", _NArray_computeShape).call(this, x[0])];
        return size;
    }
    else {
        return size;
    }
}, _NArray_computeStrides = function _NArray_computeStrides(...shape) {
    const final = [];
    let temp;
    for (let i = 1; i <= shape.length; i++) {
        if (i === shape.length) {
            final.push(1);
        }
        else {
            temp = shape.slice(i);
            final.push(temp.reduce((a, b) => a * b));
        }
    }
    return final;
}, _NArray_get = function _NArray_get(...path) {
    if (path.length <= this.strides.length) {
        if (path.length === this.strides.length) {
            let finalIndex = 0;
            path.forEach((e, i) => {
                if (e < 0) {
                    e = this.shape[i] + e;
                }
                finalIndex += e * this.strides[i];
            });
            return __classPrivateFieldGet(this, _NArray_arr, "f")[finalIndex];
        }
        else {
            const final = [];
            let currShape = this.shape[path.length];
            if (path.length + 1 === this.strides.length) {
                currShape = this.shape[path.length];
            }
            for (let i = 0; i < currShape; i++) {
                final[i] = __classPrivateFieldGet(this, _NArray_instances, "m", _NArray_get).call(this, ...path, i);
            }
            return final;
        }
    }
    else {
        throw Error(`Range out of index.

      How to fix this?
      Your NArray is of dimension ${this.ndim} put you are trying to access ${path.length} dimension data. Try changing the path passed to ${this.ndim} dimension.`);
    }
}, _NArray_flatten = function _NArray_flatten(x = __classPrivateFieldGet(this, _NArray_arr, "f")) {
    let final = [];
    let temp;
    if (!(x[0] instanceof Array)) {
        return x;
    }
    else {
        x.forEach((e) => {
            if (e instanceof _a) {
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
