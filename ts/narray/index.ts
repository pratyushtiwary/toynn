import utils from "../utils";

globalThis.NArray_printThreshold = 5;

class NArray {
  #arr: Array<any> = [];
  #computedShape: undefined | Array<number> = undefined;
  #length: undefined | number = undefined;
  #computedStrides: undefined | Array<number> = undefined;
  #ndim: undefined | number = undefined;

  constructor(obj: Array<any> | NArray) {
    /**
     * Numerical Array implementation which allows user to perform advance computational stuff
     * @param obj:<Array, NArray>
     */

    if (obj instanceof Array) {
      this.#arr = obj;
      this.#arr = Array.from(this.#arr);
      this.#computedShape = this.#computeShape(this.#arr);
      this.#computedStrides = this.#computeStrides(...this.#computedShape);
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

  #computeShape(x: Array<any>): Array<number> {
    /**
     * Recursively compute shape for provided array
     * @param x: Array
     */
    let size = [];

    if (x?.length) {
      size.push(x.length);

      size = [...size, ...this.#computeShape(x[0])];

      return size;
    } else {
      return size;
    }
  }

  #computeStrides(...shape: Array<number>): Array<number> {
    /**
     * Provided a shape it calculates number of strides
     * @param shape: Array
     */
    let final = [],
      temp;

    utils.loop({
      start: 1,
      end: shape.length + 1,
      func: (i) => {
        if (i === shape.length) {
          final.push(1);
        } else {
          temp = shape.slice(i);
          final.push(temp.reduce((a, b) => a * b));
        }
      },
    });
    return final;
  }

  #get(...path: Array<number>): Array<any> {
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
        return this.#arr[finalIndex];
      } else {
        let final = [],
          currShape = this.shape[path.length];

        if (path.length + 1 === this.strides.length) {
          currShape = this.shape[path.length];
        }

        utils.loop({
          start: 0,
          end: currShape,
          func: (i) => {
            final[i] = this.#get(...path, i);
          },
        });

        return final;
      }
    } else {
      throw Error(`Range out of index.
      
      How to fix this?
      Your NArray is of dimension ${this.ndim} put you are trying to access ${path.length} dimension data. Try changing the path passed to ${this.ndim} dimension.`);
    }
  }

  static calcNoOfElems(...shape: Array<number>): number {
    /**
     * Calculate number of elements in an array by summing up the shape
     * @param shape: Array -> shape of the array
     */
    let noOfElems = 1;

    utils.loop({
      start: 0,
      end: shape.length,
      func: (i) => {
        noOfElems *= shape[i];
      },
    });

    return noOfElems;
  }

  #flatten(x: Array<any> = this.#arr): Array<any> {
    /**
     * Recursively flattens passed array
     * @param x: Array -> defaults to value by which object is initialized
     */
    let final = [];
    let temp;
    if (!x[0]?.length) {
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

  flatten(): Array<any> {
    /**
     * Returns flat Array
     */
    return this.#arr;
  }

  reduce(func: Function): number {
    let f = this.#arr.reduce((a, b) => func(a, b));
    return f;
  }

  map(func: Function): NArray {
    let f = this.#arr.map((e, i) => func(e, i));
    return new NArray(f).reshape(...this.shape);
  }

  forEach(func: Function): void {
    this.#arr.forEach((e, i) => func(e, i));
  }

  max(): { index: number; element: any } {
    let maxIndex = 0,
      maxElem = this.#arr[0];

    utils.loop({
      end: this.length,
      func: (i: number) => {
        if (this.#arr[i] > maxElem) {
          maxIndex = i;
          maxElem = this.#arr[i];
        }
      },
    });

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

    let final: Array<any> = [],
      temp = 0,
      i = 0,
      j = 0;

    utils.loop({
      end: this.length,
      func: (o: number) => {
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
      },
    });

    let newShape;
    if (axis < this.ndim - 1) {
      newShape = this.shape.slice(1);
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
      let final = [],
        j = 0,
        k = 0;

      final[0] = this.#arr[0];

      utils.loop({
        start: 1,
        end: this.length * this.length,
        func: (i: number) => {
          if (i % (this.length * j + j) === 0) {
            final.push(this.#arr[j]);
          } else {
            final.push(0);
          }
          if ((i + 1) % this.length === 0) {
            j++;
          }
        },
      });

      return new NArray(final).reshape(this.length, this.length);
    } else if (this.ndim === 2) {
      let smaller =
        this.shape[0] < this.shape[1] ? this.shape[0] : this.shape[1];
      let final = [];
      final[0] = this.#arr[0];
      utils.loop({
        start: 1,
        end: smaller,
        func: (i: number) => {
          final[i] = this.#arr[this.shape[1] * i + i];
        },
      });

      return new NArray(final);
    }
  }

  add(y: number | NArray): NArray {
    let final: Array<any> | NArray = [],
      r: Array<any>;
    if (typeof y === "number") {
      final = this.map((e) => e + y);
    } else {
      if (!(y instanceof NArray)) {
        throw Error(`Failed to add because the passed object is not NArray

        How to fix this?
        Try converting the passed object to NArray.
        `);
      }

      r = y.flatten();

      final = this.map((e, i) => e + r[i % y.length]);
    }

    final.reshape(...this.#computedShape);

    return final;
  }

  sub(y: number | NArray): NArray {
    let final: Array<any> | NArray = [],
      r: Array<any>;
    if (typeof y === "number") {
      final = this.map((e) => e - y);
    } else {
      if (!(y instanceof NArray)) {
        throw Error(
          `Failed to subtract because the passed object is not NArray
          
          How to fix this?
          Try converting the passed object to NArray.`
        );
      }

      r = y.flatten();

      final = this.map((e, i) => e - r[i % y.length]);
    }

    final.reshape(...this.#computedShape);

    return final;
  }

  div(y: number | NArray): NArray {
    let final: Array<any> | NArray = [],
      r: Array<any>;
    if (typeof y === "number") {
      return this.map((e) => e / y);
    } else {
      if (!(y instanceof NArray)) {
        throw Error(`Failed to divide because the passed object is not NArray
        
        How to fix this?
        Try converting the passed object to NArray.`);
      }

      r = y.flatten();

      final = this.map((e, i) => e / r[i % y.length]);
    }

    final = new NArray(final);

    final.reshape(...this.#computedShape);

    return final;
  }

  mul(y: number | NArray): NArray {
    let final: Array<any> | NArray = [],
      r: Array<any>,
      temp: number;
    if (typeof y === "number") {
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

      if (y.shape[y.shape.length - 1] !== this.shape[this.shape.length - 1]) {
        throw Error(`Shapes are not aligned. Failed to multiply.
        
        How to fix this?
        Make sure the passed NArray object is of ${this.ndim} dimension and ${
          this.ndim - 1
        } dimension is equals to ${this.shape[this.shape.length - 1]}`);
      }
      r = y.flatten();

      final = this.map((e, i) => e * r[i % y.length]);
    }

    final = new NArray(final);

    final.reshape(...this.#computedShape);

    return final;
  }

  pow(y: number | NArray): NArray {
    let final: Array<any> | NArray = [],
      r: Array<any>;
    if (typeof y === "number") {
      final = this.map((e: number) => Math.pow(e, y));
    } else {
      if (!(y instanceof NArray)) {
        throw Error(`Failed to pow because the passed object is not NArray
        
        How to fix this?
        Try converting the passed object to NArray.`);
      }

      r = y.flatten();

      final = this.map((e: number, i: number) => Math.pow(e, r[i % y.length]));
    }

    final = new NArray(final);

    final.reshape(...this.#computedShape);

    return final;
  }

  dot(y: number | NArray): NArray | number {
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

    let final: Array<any> = [],
      temp = 0,
      i = 0,
      j = 0,
      k = 0,
      l = 0,
      m = 0,
      n = 0,
      arr2 = y.flatten(),
      length = y.length,
      tempShape1 = shape1.filter((e) => e !== 1),
      tempShape2 = shape2.filter((e) => e !== 1),
      breakage =
        tempShape2[tempShape2.length - 1] * tempShape2[tempShape2.length - 2];

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
    utils.loop({
      start: 0,
      end: iterCond,
      func: (o: number) => {
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
      },
    });

    return new NArray(final).reshape(...newShape);
  }

  transpose(): NArray {
    /**
     * Returns transpose of the NArray
     *
     * Reference: https://stackoverflow.com/a/32034565
     */

    const final = new NArray(this.#arr);
    final.reshape(...Array.from(this.shape).reverse());
    final.strides = Array.from(this.strides).reverse();
    return final;
  }

  reshape(...shape: Array<number>): this {
    /**
     * Broadcast array into provided shape
     * @param dims: Array -> shape to broadcast array into
     */
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

  get T(): NArray {
    /**
     * Returns transpose of the NArray
     */
    return this.transpose();
  }

  get(...path: Array<number>): Array<any> {
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
      utils.loop({
        end: this.shape[0],
        func: (i: number) => {
          final.push(this.#get(i));
        },
      });
    } else {
      final = this.#get(...path);
    }
    return final;
  }

  get real(): Array<any> {
    return this.get();
  }

  jsonify(): String {
    /**
     * Returns jsonified string of the array
     *
     * Used for printing purposes
     */
    return JSON.stringify(this.real, null, 4);
  }

  toString(): String {
    if (this.length > globalThis.NArray_printThreshold) {
      let finalStr = "";

      for (let i = 0; i < this.shape.length; i++) {
        finalStr += "[";
      }

      finalStr += this.#arr[0];

      finalStr += "...";

      finalStr += this.#arr[this.length - 1];

      for (let i = 0; i < this.shape.length; i++) {
        finalStr += "]";
      }

      return finalStr;
    }
    return JSON.stringify(this.real);
  }

  valueOf(): Array<any> {
    return this.real;
  }

  static zeroes(...shape: Array<number>): NArray {
    /**
     * Returns a provided dimension NArray with all of its values as 0
     * @param dims: Array -> shape of the new NArray
     */
    const temp = [];
    const elems = NArray.calcNoOfElems(...shape);

    utils.loop({
      end: elems,
      func: () => {
        temp.push(0);
      },
    });

    return new NArray(temp).reshape(...shape);
  }

  static arange(
    start: number = 1,
    end: undefined | number = undefined,
    step: number = 1
  ): NArray {
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

    utils.loop({
      end: end,
      start: start,
      func: (i: number) => {
        values.push(i);
      },
    });

    return new NArray(values);
  }

  static randn(mean: number = 0, stdev: number = 1): number {
    /**
     * Returns random number as per normal distribution
     */
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
