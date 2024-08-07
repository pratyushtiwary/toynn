import type {
    Element,
    NArrayInput,
    NArrayReduceFunction,
    NArrayMapFunction,
    NArrayForEachFunction,
} from '@/narray/types';

globalThis.NArray_printThreshold = 5;

export class NArray {
    #arr: NArrayInput = [];
    #computedShape: undefined | Array<number> = undefined;
    #length: undefined | number = undefined;
    #computedStrides: undefined | Array<number> = undefined;
    #ndim: undefined | number = undefined;

    /**
     * Numerical Array implementation which allows user to perform advance computational stuff
     * @param obj {NArrayInput | NArray}
     */
    constructor(obj: NArrayInput | NArray) {
        if (obj instanceof Array) {
            this.#arr = obj;
            this.#arr = Array.from(this.#arr);
            this.#computedShape = this.#computeShape(this.#arr);
            this.#computedStrides = this.#computeStrides(
                ...this.#computedShape
            );
            this.#ndim = this.#computedShape.length;
            // flatten the array after computing shape
            this.#arr = this.#flatten(this.#arr);

            if (this.length !== NArray.calcNoOfElems(...this.#computedShape)) {
                throw Error(
                    `The passed array doesn't seems to follow a fixed shape. NArray's need to have a fixed shape.

          How to fix this?

          Make sure the number of elements in your array(${
              this.length
          }) is equals to the product of ${this.#computedShape}
          `
                );
            }
        } else if (obj instanceof NArray) {
            this.#arr = obj.flatten();
            this.#computedShape = obj.shape;
            this.#computedStrides = obj.strides;
            this.#ndim = obj.ndim;
        } else {
            throw Error(`Unsupported object type.

      How to fix this?

      Looks like you've tried converting ${typeof obj} to an NArray.
      NArray only supports Array and NArray to be converted into NArray.
      Try converting your object to array.
      `);
        }
    }

    /**
     * Recursively compute shape for provided array
     * @param x: Array
     */
    #computeShape(x: NArrayInput): Array<number> {
        let size = [];

        if (x instanceof Array) {
            size.push(x.length);

            size = [...size, ...this.#computeShape(x[0])];

            return size;
        } else {
            return size;
        }
    }

    /**
     * Provided a shape it calculates number of strides
     * @param shape: Array
     */
    #computeStrides(...shape: Array<number>): Array<number> {
        const final = [];
        let temp: number[];
        for (let i = 1; i <= shape.length; i++) {
            if (i === shape.length) {
                final.push(1);
            } else {
                temp = shape.slice(i);
                final.push(temp.reduce((a, b) => a * b));
            }
        }
        return final;
    }

    /**
     * Recusively gets value for the specified path
     *
     * Used by the get function
     */
    #get(...path: Array<number>): NArrayInput {
        if (path.length <= this.strides.length) {
            if (path.length === this.strides.length) {
                let finalIndex = 0;
                path.forEach((e, i) => {
                    if (e < 0) {
                        e = this.shape[i] + e;
                    }
                    finalIndex += e * this.strides[i];
                });
                return this.#arr[finalIndex];
            } else {
                const final = [];
                let currShape = this.shape[path.length];

                if (path.length + 1 === this.strides.length) {
                    currShape = this.shape[path.length];
                }
                for (let i = 0; i < currShape; i++) {
                    final[i] = this.#get(...path, i);
                }
                return final;
            }
        } else {
            throw Error(`Range out of index.

      How to fix this?
      Your NArray is of dimension ${this.ndim} put you are trying to access ${path.length} dimension data. Try changing the path passed to ${this.ndim} dimension.`);
        }
    }

    /**
     * Calculate number of elements in an array by summing up the shape
     * @param shape: Array -> shape of the array
     */
    static calcNoOfElems(...shape: Array<number>): number {
        let noOfElems = 1;

        for (let i = 0; i < shape.length; i++) {
            noOfElems *= shape[i];
        }

        return noOfElems;
    }

    /**
     * Recursively flattens passed array
     * @param x: Array -> defaults to value by which object is initialized
     */
    #flatten(x: NArrayInput = this.#arr): NArrayInput {
        let final = [];
        let temp;
        if (!(x[0] instanceof Array)) {
            return x;
        } else {
            x.forEach((e) => {
                if (e instanceof NArray) {
                    temp = e.flatten();
                } else {
                    temp = this.#flatten(e);
                }
                final = [...final, ...temp];
            });
            return final;
        }
    }

    get shape(): Array<number> {
        return this.#computedShape;
    }

    get strides(): Array<number> {
        return this.#computedStrides;
    }

    get length(): number {
        if (!this.#length) {
            this.#length = this.#arr.length;
        }
        return this.#length;
    }

    get ndim(): number {
        return this.#ndim;
    }

    set strides(newStrides: Array<number>) {
        if (!(newStrides instanceof Array)) {
            throw Error(`Failed to change stride

      How to fix this?
      Try chaning the newStrides passed into an array.`);
        } else if (newStrides.length !== this.shape.length) {
            throw Error(
                `strides must be same length as shape (${this.shape.length})

        How to fix this?
        Make sure new strides have ${this.ndim} number of elements.`
            );
        }

        this.#computedStrides = newStrides;
    }

    /**
     * Returns flat Array
     */
    flatten(): NArrayInput {
        return this.#arr;
    }

    reduce(func: NArrayReduceFunction): number {
        const f = this.#arr.reduce((a, b) => func(a, b));
        return f;
    }

    map(func: NArrayMapFunction): NArray {
        const f = this.#arr.map((e, i) => func(e, i));
        return new NArray(f).reshape(...this.shape);
    }

    forEach(func: NArrayForEachFunction): void {
        this.#arr.forEach((e, i) => func(e, i));
    }

    max(): { index: number; element: Element } {
        let maxIndex = 0,
            maxElem = this.#arr[0];

        for (let i = 0; i < this.length; i++) {
            if (this.#arr[i] > maxElem) {
                maxIndex = i;
                maxElem = this.#arr[i];
            }
        }

        return { index: maxIndex, element: maxElem };
    }

    sum(axis: number = undefined): NArray {
        if (axis > this.ndim - 1 || axis < 0) {
            throw Error(`Axis out of bound

      How to fix this?
      Try changing axis to a number between 0 and ${this.ndim - 1}.`);
        }

        if (axis === undefined) {
            return new NArray([this.reduce((a: number, b: number) => a + b)]);
        }

        const inc = this.strides[axis],
            breakage = this.shape[axis],
            prevBreakage = this.strides[axis - 1];

        const final: NArrayInput = [];
        let temp = 0,
            i = 0,
            j = 0;

        for (let o = 0; o < this.length; o++) {
            temp += this.#arr[j];
            j += inc;

            if ((o + 1) % breakage === 0) {
                final.push(temp);
                temp = 0;
                if (axis === 0) {
                    i++;
                } else if (axis > 0 && axis < this.ndim - 1) {
                    if ((o + 1) % prevBreakage === 0) {
                        i = o + breakage - 1;
                    } else {
                        i++;
                    }
                } else {
                    i += breakage;
                }
                j = i;
            }
        }

        let newShape;
        if (axis < this.ndim - 1) {
            newShape = [
                ...this.shape.slice(0, axis),
                ...this.shape.slice(axis + 1),
            ];
        } else {
            newShape = this.shape.slice(0, -1);
        }
        return new NArray(final).reshape(...newShape);
    }

    diag(): NArray {
        if (this.ndim > 2) {
            throw Error(`NArray should be either 1d or 2d

      How to fix this?
      Try reshaping your NArray to convert it into 1d or 2d NArray.`);
        }
        if (this.ndim === 1) {
            const final = [];
            let j = 0;

            final[0] = this.#arr[0];

            for (let i = 1; i < this.length * this.length; i++) {
                if (i % (this.length * j + j) === 0) {
                    final.push(this.#arr[j]);
                } else {
                    final.push(0);
                }
                if ((i + 1) % this.length === 0) {
                    j++;
                }
            }

            return new NArray(final).reshape(this.length, this.length);
        } else if (this.ndim === 2) {
            const smaller =
                this.shape[0] < this.shape[1] ? this.shape[0] : this.shape[1];
            const final = [];
            final[0] = this.#arr[0];
            for (let i = 1; i < smaller; i++) {
                final[i] = this.#arr[this.shape[1] * i + i];
            }

            return new NArray(final);
        }
    }

    add(y: number | NArray): NArray {
        let final: NArrayInput | NArray = [],
            r: NArrayInput;
        if (typeof y === 'number') {
            const temp: number = y;
            final = this.map((e) => e + temp);
        } else if (y.length === 1) {
            const temp: number = y.flatten()[0];
            final = this.map((e) => e + temp);
        } else if (this.length === 1) {
            const temp: number = this.#arr[0];
            final = y.map((e) => temp + e);
            return final.reshape(...y.shape);
        } else {
            if (!(y instanceof NArray)) {
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

            final = this.map((e, i: number) => e + r[i]);
        }

        final.reshape(...this.#computedShape);

        return final;
    }

    sub(y: number | NArray): NArray {
        let final: NArrayInput | NArray = [],
            r: NArrayInput;
        if (typeof y === 'number') {
            const temp: number = y;
            final = this.map((e: number) => e - temp);
        } else if (y.length === 1) {
            const temp: number = y.flatten()[0];
            final = this.map((e) => e - temp);
        } else if (this.length === 1) {
            const temp: number = this.#arr[0];
            final = y.map((e) => temp - e);
            return final.reshape(...y.shape);
        } else {
            if (!(y instanceof NArray)) {
                throw Error(
                    `Failed to subtract because the passed object is not NArray

          How to fix this?
          Try converting the passed object to NArray.`
                );
            }

            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to subtract.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }

            r = y.flatten();

            final = this.map((e, i: number) => e - r[i]);
        }

        final.reshape(...this.#computedShape);

        return final;
    }

    div(y: number | NArray): NArray {
        let final: NArrayInput | NArray = [],
            r: NArrayInput;
        if (typeof y === 'number') {
            return this.map((e) => e / y);
        } else if (y.length === 1) {
            const temp: number = y.flatten()[0];
            final = this.map((e) => e / temp);
        } else if (this.length === 1) {
            const temp: number = this.#arr[0];
            final = y.map((e) => temp / e);
            return final.reshape(...y.shape);
        } else {
            if (!(y instanceof NArray)) {
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

            final = this.map((e, i: number) => e / r[i]);
        }

        final = new NArray(final);

        final.reshape(...this.#computedShape);

        return final;
    }

    mul(y: number | NArray): NArray {
        let final: NArrayInput | NArray = [],
            r: NArrayInput,
            temp: number;
        if (typeof y === 'number') {
            temp = y;
            final = this.map((e: number) => e * temp);
        } else if (y instanceof NArray && y.length === 1) {
            temp = y.flatten()[0];
            final = this.map((e: number) => e * temp);
        } else if (this.length === 1) {
            temp = this.#arr[0];
            final = y.map((e: number) => e * temp);
            return final.reshape(...y.shape);
        } else {
            if (!(y instanceof NArray)) {
                throw Error(
                    `Failed to multiply because the passed object is not NArray

          How to fix this?
          Try converting the passed object to NArray.`
                );
            }

            if (
                y.shape[y.shape.length - 1] !==
                this.shape[this.shape.length - 1]
            ) {
                throw Error(`Shapes are not aligned. Failed to multiply.

        How to fix this?
        Make sure the passed NArray object is of ${this.ndim} dimension and ${
            this.ndim - 1
        } dimension is equals to ${this.shape[this.shape.length - 1]}`);
            }

            if (this.length !== y.length) {
                throw Error(`Shape mismatch, failed to multiply.

        How to fix this?
        Make sure y.shape = ${this.shape}`);
            }
            r = y.flatten();

            final = this.map((e, i: number) => e * r[i]);
        }

        final = new NArray(final);

        final.reshape(...this.#computedShape);

        return final;
    }

    pow(y: number | NArray): NArray {
        let final: NArrayInput | NArray = [],
            r: NArrayInput;
        if (typeof y === 'number') {
            final = this.map((e: number) => Math.pow(e, y));
        } else if (y.length === 1) {
            const temp: number = y.flatten()[0];
            final = this.map((e) => Math.pow(e, temp));
        } else if (this.length === 1) {
            const temp: number = this.#arr[0];
            final = y.map((e) => Math.pow(temp, e));
            return final.reshape(...y.shape);
        } else {
            if (!(y instanceof NArray)) {
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

            final = this.map((e, i: number) => Math.pow(e, r[i]));
        }

        final = new NArray(final);

        final.reshape(...this.#computedShape);

        return final;
    }

    dot(y: number | NArray): NArray {
        if (!(y instanceof NArray)) {
            throw Error(`Failed to dot because the passed object is not NArray

      How to fix this?
      Try converting the passed object to NArray.`);
        }
        if (this.ndim === 1 && y.ndim === 1) {
            return this.mul(y).sum();
        }

        if (y.ndim === 1 || this.ndim === 1) {
            if (
                this.shape[this.shape.length - 1] !==
                y.shape[y.shape.length - 1]
            ) {
                throw Error(`Shapes are not aligned. Failed to dot

        How to fix this?
        Make sure ${y.ndim - 1} dimension(${
            y.shape[y.shape.length - 1]
        }) is equal to ${this.ndim - 1} dimension(${
            this.shape[this.shape.length - 1]
        })`);
            }

            return this.mul(y);
        }

        const shape1 = this.shape,
            shape2 = y.shape;

        if (this.ndim !== y.ndim) {
            throw Error(`Passed NArray is not of same dimension.

      How to fix this?
      Reshape the passed NArray to ${this.ndim} dimension`);
        }

        if (this.ndim === 2) {
            if (shape1[1] !== shape2[0]) {
                throw Error(
                    `Shapes ${shape1} and ${shape2} are not aligned. ${shape1[1]}(dim=1) != ${shape2[0]}(dim=0).

          How to fix this?
          Reshape your passed array with dimension 0 as ${shape1[1]}`
                );
            }
        }

        if (this.ndim > 2 || y.ndim > 2) {
            if (shape1[shape1.length - 1] !== shape2[shape2.length - 2]) {
                throw Error(
                    `Shapes ${shape1} and ${shape2} are not aligned. ${
                        shape1[shape1.length - 1]
                    }(dim=${this.ndim - 1}) != ${shape2[shape2.length - 2]}(dim=${
                        y.ndim - 2
                    })

          How to fix this?
          Reshape your passed array with dimension ${y.ndim - 2} as ${
              shape1[shape1.length - 1]
          }`
                );
            }
        }

        const newShape = [
            ...shape1.slice(0, -1),
            ...shape2.slice(0, shape2.length - 2),
            shape2[shape2.length - 1],
        ];

        const final: NArrayInput = [];
        let temp = 0,
            i = 0,
            j = 0,
            k = 0,
            l = 0,
            m = 0,
            n = 0,
            tempShape1 = shape1.filter((e) => e !== 1),
            tempShape2 = shape2.filter((e) => e !== 1),
            breakage =
                tempShape2[tempShape2.length - 1] *
                tempShape2[tempShape2.length - 2];

        const arr2 = y.flatten(),
            length = y.length;

        if (
            (shape2[shape2.length - 1] === 1 && tempShape2.length === 1) ||
            (shape1[shape1.length - 1] === 1 && tempShape1.length === 1)
        ) {
            tempShape1 = shape1;
            tempShape2 = shape2;
            breakage = tempShape2[tempShape2.length - 2];
        }

        if (this.length === 1 || y.length === 1) {
            tempShape1 = shape1;
            tempShape2 = shape2;
        }

        const shape1Last = tempShape1[tempShape1.length - 1],
            shape2Last = tempShape2[tempShape2.length - 1],
            newLen = NArray.calcNoOfElems(...newShape),
            iterCond = newLen * shape1Last;

        for (let o = 0; o < iterCond; o++) {
            temp += this.#arr[i] * arr2[l + k];
            i++;
            k += shape2Last;

            if ((j + 1) % shape2Last === 0 && (o + 1) % shape1Last === 0) {
                if (l === 0) {
                    l = breakage;
                } else {
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

        return new NArray(final).reshape(...newShape);
    }

    /**
     * Returns transpose of the NArray
     *
     * Reference: https://stackoverflow.com/a/32034565
     */
    transpose(): NArray {
        const final = new NArray(this.#arr);
        final.reshape(...Array.from(this.shape).reverse());
        final.strides = Array.from(this.strides).reverse();
        return final;
    }

    /**
     * Broadcast array into provided shape
     * @param dims: Array -> shape to broadcast array into
     */
    reshape(...shape: Array<number>): this {
        // check if there is any imaginary dimension(-1) given
        const imaginaryDimFound = shape.filter((e) => e === -1).length;
        const tempShape = shape.filter((e) => e !== -1);
        const newLen = NArray.calcNoOfElems(...tempShape);
        if (imaginaryDimFound === 1) {
            let imaginaryDim = 0;

            imaginaryDim = this.length / newLen;

            shape = shape.map((e) => (e === -1 ? imaginaryDim : e));
        } else if (imaginaryDimFound > 1) {
            throw Error(
                `Failed to reshape, only single imaginary dimension is supported`
            );
        }
        if (NArray.calcNoOfElems(...shape) !== this.length) {
            throw Error(
                `Array of dimension ${this.shape} can't be broadcasted into ${shape} dimension

        How to fix this?
        The passed shape(${shape}) product is not equal to ${this.length}, make sure that you pass the new shape whose product is equal to ${this.length}`
            );
        }

        this.#computedShape = shape;
        this.strides = this.#computeStrides(...shape);
        this.#ndim = shape.length;
        return this;
    }

    /**
     * Returns transpose of the NArray
     */
    get T(): NArray {
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
    get(...path: Array<number>): NArrayInput {
        let final = [];
        if (path.length === 0) {
            for (let i = 0; i < this.shape[0]; i++) {
                final.push(this.#get(i));
            }
        } else {
            final = this.#get(...path);
        }
        return final;
    }

    get real(): NArrayInput {
        return this.get();
    }

    /**
     * Returns jsonified string of the array
     *
     * Used for printing purposes
     */
    jsonify(): string {
        return JSON.stringify(this.real, null, 4);
    }

    toString(): string {
        if (this.length > globalThis.NArray_printThreshold) {
            let finalStr = '';

            for (let i = 0; i < this.shape.length; i++) {
                finalStr += '[';
            }

            finalStr += this.#arr[0];

            finalStr += '...';

            finalStr += this.#arr[this.length - 1];

            for (let i = 0; i < this.shape.length; i++) {
                finalStr += ']';
            }

            return finalStr;
        }
        return JSON.stringify(this.real);
    }

    valueOf(): NArrayInput {
        return this.real;
    }

    /**
     * Returns a provided dimension NArray with all of its values as 0
     * @param dims: Array -> shape of the new NArray
     */
    static zeros(...shape: Array<number>): NArray {
        const temp = [];
        const elems = NArray.calcNoOfElems(...shape);

        for (let i = 0; i < elems; i++) {
            temp.push(0);
        }

        return new NArray(temp).reshape(...shape);
    }

    /**
     * Returns a flat NArray with elements ranging from start -> end with specified step increment
     * @param start: int -> start of the range
     * @param end: int -> end of the range
     * @param step: int -> stride
     */
    static arange(
        start: number = 0,
        end: undefined | number = undefined,
        step: number = 1
    ): NArray {
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

        return new NArray(values);
    }

    /**
     * Returns random number as per normal distribution
     */
    static randn(mean: number = 0, stdev: number = 1): number {
        const u1 = Math.random();
        const u2 = Math.random();

        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        return z * stdev + mean;
    }

    static setPrintThreshold(n: number) {
        globalThis.NArray_printThreshold = n;
    }
}

export default NArray;
