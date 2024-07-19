---
title: Intro to DatasetSlice
description: A guide to DatasetSlice
---

DatasetSlice allows you to lazily arrange your Dataset's data.

DatasetSlice is faster when it comes to shuffling than normal Arrays.

## Creating DatasetSlice

```js
import toynn from 'toynn';

const myDataset = await toynn.Dataset.from('./myData.csv');

console.log(myDataset.toArray().map((e) => e.flatten())); // => [[1,2],[3,4],[5,6]]
const myDatasetSlice = new toynn.DatasetSlice(myDataset, [1, 0, 2]);

console.log(myDatasetSlice.toArray().map((e) => e.flatten())); // => [[3,4],[1,2],[5,6]]
```

**Note: All [methods](/dataset/methods) of Dataset are supported by DatasetSlice and works the same way.**
