---
title: NArray shape
description: Guide on how NArray shape works
---

Shapes define the structure of your NArray.

Any newly created NArray automatically follows the shape of object which was used to create it.

```js
import toynn from "toynn";

const myArray = [
  [1, 2],
  [3, 4],
]; // shape: 2,2

const myNArray = new toynn.NArray(myArray);

console.log(myNArray.shape); // => [2,2]
```

**Note: You cannot direclty change the shape of any NArray.**

## reshape

```
Signature: reshape(...shape: number[]): this
```

Using this method of your NArray object you can change its shape.

Shape should always be able to contain the elements in the NArray. For example if you have 4 elements inside your NArray then the new shape should always be something whose product is equal to 4.

You can use [NArray.calcNoOfElems()](/narray/#static-functions) to calculate number of elements that can be present in your new shape.
