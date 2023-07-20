# NArray

Numerical Array(NArray) is a small implementation of NumPY using JS. The whole thing is written in JS.

**All functions of NumPY are not implemented**

**This implementation is inspired from NumPY, it doesn't strictly follow its specs**

**NArrays are immutable, only their strides and shape can be mutated not their elements.**

## Usage

```js
// imports

let k = NArray.arange(32).reshape(2, 2, 4, 2);

console.log(k.T.real); // transpose the NArray and convert to Array
```

## Static Functions

### arange(start=0,end=undefined,step=1)

Generates an NArray with values ranging from defined `start` and `end`-1, step defines the gap between each elements.

### calcNoOfElems(...shape)

Returns number of elements an NArray can have with the provided shape.

### zeroes(...shape)

Generates an NArray with each element being 0 of specified shape.

### randn(mean:int=0, stdev:int=1)

Returns random number as per normal distribution

### setPrintThreshold(n: number)

Sets the printThreshold for `toString()`

## Properties and Member Functions

### constructor(obj:<Array,NArray>)

Passing an NArray results in faster object construction. Array to NArray is generally more time taking than NArray to NArray conversion.

### shape

Returns the shape of the NArray

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.shape); // [2,2,4,2]
```

### strides

Returns the strides of the NArray.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.strides); // [16,8,2,1]
```

### T

Returns transpose of the NArray

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.T);
```

### ndim

Returns the number of dimension of the NArray

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.ndim); // 4
```

### length

Returns the number of elements in the NArray.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.length); // 32
```

### real

Returns Array representation of the NArray

**This property is time consuming, try to use it after performing all computations**

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.real);
```

### transpose

Returns transpose of the NArray

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.transpose());
```

### reshape(...shape)

Changes shape of the NArray.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
k.reshape(4, 4, 2);
```

### flatten()

Returns Array which is flattened version of the NArray.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.flatten()); // [0, ..., 31];
```

### get(...path)

It either returns Array with elements or the element found at the specified path.

Calling it without any path specified will return the whole Array in the shape of NArray.

**It is a costly function and take more time than any other function**

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.get(0, 0)); // [ [ 0, 1 ], [ 2, 3 ], [ 4, 5 ], [ 6, 7 ] ]
```

### map(func)

Works similar to Array.prototype.map.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.map((e) => e + 1).real); // Each element will have e+1 as their value, where e = element at that index
```

### add(y:<int,NArray>)

Can be used to add 2 NArrays of same size or can be used to increment NArray by a specified number

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.add(1).real);
```

### sub(y:<int,NArray>)

Can be used to subtract 2 NArrays of same size or can be used to decrement NArray by a specified number

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.sub(1).real);
```

### div(y:<int,NArray>)

Can be used to divide 2 NArrays of same size with each other or can be used to divide NArray by a specified number

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.div(2).real);
```

### mul(y:<int,NArray>)

Can be used to multiply 2 NArrays of same size with each other or can be used to multiply NArray by a specified number

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.mul(2).real);
```

### pow(y:<int,NArray>)

Can be used to raise 2 NArrays of same size with each other or can be used to raise NArray by a specified number

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.pow(2).real);
```

### dot(y:<int,NArray>)

- If both NArrays are 1d then it uses mul(y)
- If any of the NArray.ndim >= 2 then normal matrix dot product is done

Usage:

```js
// imports
let x = NArray.arange(32).reshape(2, 2, 4, 2);
let y = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(x.dot(y).real);
```

### jsonify()

Returns a pretty-print version of the NArray.

Usage:

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.jsonify());
```

### sum(axis<undefined,int>=undefined)

Returns sum of the elements of NArray.

If axis is not defined, returns sum of all elements,
If axis is defined, returns sum of elements for the axis

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.sum(0)); // column wise sum
```

### max()

Returns the max element and it's index.

```js
// imports
let k = NArray.arange(32).reshape(2, 2, 4, 2);
console.log(k.max());
```

### diag()

Returns diagonal matrix, it only works on 1 and 2-d NArrays.

```js
// imports
let k = NArray.arange(32).reshape(8, 4);
console.log(k.diag().real);
```

## References

- [Transpose is implemented using the logic explained in this answer](https://stackoverflow.com/a/32034565)
