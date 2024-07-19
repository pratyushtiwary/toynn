---
title: Dataset Methods
description: A guide to all the methods supported by Dataset
sidebar:
    order: 2
---

Dataset comes with methods which allows you to manipulate your data.

### get

```
Signature: get(index: number): NArray
```

Returns row as NArray for the specified index.

You can use negative indexing here.

### slice

```
Signature: slice(...selection: Array[]): Dataset
```

Use this to slice a Dataset vertically(column-wise).

### length

Use this property to get the number of rows in your Dataset.

```js
import toynn from 'toynn';

const obj = [new toynn.NArray([1, 2, 3, 4])];

const myDataset = new toynn.Dataset(obj);
console.log(myDataset.length); // => 1
```

### toArray

```
Signature: toArray(): NArray[]
```

Converts Dataset to Array of NArrays

### onGet

```
Signature: onGet(element: NArray): NArray
```

Overwrite this function to add custom logic to process single row.

Make sure that your function is following the `Signature` while overwritting it.
