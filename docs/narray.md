# NArray

Numerical Array(NArray) is a small implementation of NumPY using JS. The whole thing is written in JS.

**All functions of NumPY are not implemented**

**This implementation is inspired from NumPY, it doesn't strictly follow its specs**

## Usage

```js
// imports

let k = NArray.arange(32).reshape(2, 2, 4, 2);

console.log(k.T.real); // transpose the NArray and convert to Array
```

## Benchmark

Creation x 182 ops/sec ±7.57% (56 runs sampled)
Avg. Time Taken: 0.005482847321428571 (in secs)
Transpose x 1,045 ops/sec ±4.31% (77 runs sampled)
Avg. Time Taken: 0.0009566256334551809 (in secs)
Dot x 39.77 ops/sec ±11.08% (52 runs sampled)
Avg. Time Taken: 0.025145046794871787 (in secs)
Flatten x 18,070,725 ops/sec ±5.51% (75 runs sampled)
Avg. Time Taken: 5.533812388339641e-8 (in secs)
Map x 226 ops/sec ±1.94% (79 runs sampled)
Avg. Time Taken: 0.004433656645569623 (in secs)
Add x 67.85 ops/sec ±0.65% (63 runs sampled)
Avg. Time Taken: 0.014738354761904764 (in secs)
Sub x 68.60 ops/sec ±0.56% (64 runs sampled)
Avg. Time Taken: 0.014577041796875 (in secs)
Div x 60.90 ops/sec ±1.96% (59 runs sampled)
Avg. Time Taken: 0.01641966440677966 (in secs)
Mul x 57.36 ops/sec ±2.50% (56 runs sampled)
Avg. Time Taken: 0.017432614732142856 (in secs)
Pow x 30.99 ops/sec ±1.42% (51 runs sampled)
Avg. Time Taken: 0.03226735392156864 (in secs)
Sum x 98.93 ops/sec ±9.21% (66 runs sampled)
Avg. Time Taken: 0.010108087121212118 (in secs)
Diag x 59,460 ops/sec ±7.61% (59 runs sampled)
Avg. Time Taken: 0.000016818155847354984 (in secs)
Reshape x 828,837 ops/sec ±5.53% (74 runs sampled)
Avg. Time Taken: 0.000001206509129117817 (in secs)
Get x 20.43 ops/sec ±1.04% (35 runs sampled)
Avg. Time Taken: 0.048954482857142864 (in secs)
Real x 20.71 ops/sec ±0.82% (35 runs sampled)
Avg. Time Taken: 0.04828314857142857 (in secs)
zeroes x 131 ops/sec ±2.26% (67 runs sampled)
Avg. Time Taken: 0.007662473320895522 (in secs)
arange x 128 ops/sec ±1.32% (74 runs sampled)
Avg. Time Taken: 0.007795639961389958 (in secs)
randn x 17,857,592 ops/sec ±5.74% (72 runs sampled)
Avg. Time Taken: 5.599859097984838e-8 (in secs)

## Static Functions

### arange(start=0,end=undefined,step=1)

Generates an NArray with values ranging from defined `start` and `end`-1, step defines the gap between each elements.

### calcNoOfElems(...shape)

Returns number of elements an NArray can have with the provided shape.

### zeroes(...shape)

Generates an NArray with each element being 0 of specified shape.

### randn(mean:int=0, stdev:int=1)

Returns random number as per normal distribution

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

## References

- https://stackoverflow.com/a/32034565 :- Transpose is implemented using the logic explained in this answer
