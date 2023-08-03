---
title: NArray Methods
description: A guide to all the methods supported by NArray
sidebar:
  order: 2
---

NArray comes with a lot of methods to help your perform numerical operations.

### transpose

```
Signature: transpose(): NArray
```

Returns transpose of the NArray.

### flatten

```
Signature: flatten(): Array
```

Returns Array which is a flattened version of the NArray.

### get

```
Signature: get(...path: number[]): Array
```

It either returns an Array with elements or the element found at the specified path.

Calling it without any path specified will return the whole Array in the shape of an NArray.

**It is a costly function and takes more time than any other function.**

**Negative indexing is not supported**

### map

```
Signature: map(func: Function)
```

Works similar to [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### add

```
Signature: add(y: number|NArray): NArray
```

It can be used to add 2 NArrays of the same size or can be used to increment NArray by a specified number

**Note: For this operation to work both the NArrays should have same number of elements or an error will be thrown**

### sub

```
Signature: sub(y: number|NArray): NArray
```

It can be used to subtract 2 NArrays of the same size or can be used to decrement NArray by a specified number

**Note: For this operation to work both the NArrays should have same number of elements or an error will be thrown**

### mul

```
Signature: mul(y: number|NArray): NArray
```

It can be used to multiply 2 NArrays of the same size as each other or can be used to multiply NArray by a specified number

**Note: For this operation to work both the NArrays should have same number of elements or an error will be thrown**

### div

```
Signature: div(y: number|NArray): NArray
```

It can be used to divide 2 NArrays of the same size as each other or can be used to divide NArray by a specified number

**Note: For this operation to work both the NArrays should have same number of elements or an error will be thrown**

### pow

```
Signature: pow(y: number|NArray): NArray
```

It can be used to raise 2 NArrays of the same size as each other or can be used to raise NArray by a specified number

**Note: For this operation to work both the NArrays should have same number of elements or an error will be thrown**

### dot

```
Signature: dot(y: number|NArray): NArray
```

Performs dot multiplication of NArrays.

- If both NArrays are 1d then it uses mul(y)
- If any of the NArray.ndim >= 2 then normal matrix dot product is done

### jsonify

```
Signature: jsonify(): string
```

Returns a pretty-print version of the NArray.

### sum

```
Signature: sum(axis :undefined|number = undefined): NArray
```

Returns the sum of the elements of NArray.

- If the axis is not defined, returns the sum of all elements,
- If the axis is defined, returns the sum of elements for the axis

### max

```
Signature: max(): Object
```

Returns the max element and its index as object.

```js
import toynn from "toynn";

const myNArray = toynn.NArray.arange(32);

console.log(myNArray.max()); // { index: 31, element: 31 }
```

### diag

```
Signature: diag(): NArray
```

Returns diagonal matrix, only works on 1 and 2-d NArrays.

### toString()

```
Signature: toString(): string
```

Returns string version of the NArray object.

**The returned string version will be truncated based on [printThreshold](/narray/intro#static-functions)**
