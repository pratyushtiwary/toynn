---
title: Intro to Dataset
description: A guide to how you can use Dataset
sidebar:
    order: 1
---

Dataset allows you to load delimited files and parse them to convert them into Array of NArrays.

## Usage

```js
import toynn from 'toynn';

const myDataset = await toynn.Dataset.from('./iris.csv');
```

You can pass a path or a URL or an Array of NArray to the `from` function.

## Static Functions

#### from

```
Signature: async from(loc: string | Array, options: DatasetOptions)
```

You can use this static function to create Dataset from, a path, an URL or Array of NArrays.

A file loaded from a URL is cached for 1 day.

## Creating Dataset Object

You can directly use `new Dataset(obj)` to create a `Dataset`. You can only pass Array of NArray as the object inside Dataset constructor. If in case you want to load data from some file or URL you can use `from('path')` to load the data.

```js
import toynn from 'toynn';

const obj = [new toynn.NArray([1, 2, 3, 4])];

const myDataset = new toynn.Dataset(obj);
// or
const myOtherDataset = await toynn.Dataset.from('someURLOrPath');
```

## Dataset Options

These are the options that you can pass to `from` method.

#### delimiter?: string

While parsing this will be used to split a single line. Defaults to ','

#### headerCol?: number

These many lines will be skipped when reading the data. Defaults to 1
