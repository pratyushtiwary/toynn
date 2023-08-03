---
title: Intro to NArray
description: A guide to how you can use NArray
sidebar:
  order: 1
---

Numerical Array(NArray) is a tiny implementation of NumPY using JS. The whole thing is written in JS.

All functions of NumPY are not implemented

**This implementation is inspired by NumPy, it doesn't strictly follow its specs.**

**NArrays are immutable, only their strides and shape can be mutated not their elements.**

## Usage

After installing toynn you can import it directly from toynn package.

```js
import { NArray } from "toynn";

const myNArray = NArray.arange(40).reshape(5, 8);
const transposedNArray = myNArray.T; // you can also use transpose method

console.log(transposedNArray.real); // converts NArray to Array
```

## Creating Objects

Only Arrays and other NArrays can be converted into NArray, passing anything else will result into an error.

```js
import toynn from "toynn";

const myArray = [1, 2, 3, 4, 5];

const myNArray1 = new toynn.NArray(myArray); // ✔
const myNArray2 = new toynn.NArray(myNArray1); // ✔
const myNArray3 = new toynn.NArray(3); // ❌
```

## Static Functions

#### arange

```
Signature: arange(start: number = 0,end: number = undefined,step :number = 1)
```

Generates an NArray with values ranging from defined start and end-1, the step defines the gap between each element.

#### calcNoOfElems

```
Signature: calcNoOfElems(...shape: number[])
```

Returns the number of elements a NArray can have with the provided shape.

#### zeroes

```
Signature: zeroes(...shape: number[])
```

Generates an NArray with each element being 0 of specified shape.

#### randn

```
Signature: randn(mean :number = 0, stdev :number = 1)
```

Returns random number as per the normal distribution

#### setPrintThreshold

```
Signature: setPrintThreshold(n: number)
```

Sets the printThreshold for [toString()](/narray/toString)

## References

Some of the functionality is implemented using the awesome resources from the internet.

- ✨ [Transpose is implemented using the logic explained in this answer,](https://stackoverflow.com/a/32034565),
- ✨ [`randn` is implemented using the logic explained in this answer](https://stackoverflow.com/a/36481059)
