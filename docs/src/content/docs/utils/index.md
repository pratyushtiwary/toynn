---
title: Intro to Utils
description: A guide to how you can use Utils
sidebar:
    order: 1
---

Utils methods acts as a helper, so that you don't have to implement commonly used function by yourself.

## Methods

### shuffle

```
Signature: shuffle: (arr: number | Array | Dataset | DatasetSlice): Array | DatasetSlice
```

Shuffles the provided arr.

### onehotEncode

```
Signature: onehotEncode: (x: number, classes: number): Array
```

Returns Array from the passed x after one-hot encoding it as per the classes specified.

### createBatch

```
Signature: createBatch: (array: Array | Dataset | DatasetSlice,batchSize: number): Array[]
```

Returns batches of the array passed as per the specified batchSize.

### trainTestSplit

```
Signature: trainTestSplit: (X: Dataset,y: Dataset,{ testSize, shuffle = false }: TrainTestSplitInput): DatasetSlice[]
```

Returns Array of DatasetSlice[trainX,testX,trainY,testY] as per the specified configuration.

## References

Some of the functionality is implemented using the awesome resources from the internet.

-   ✨ [Logic for shuffle is taken from here](https://stackoverflow.com/a/11935263)
