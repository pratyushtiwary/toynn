---
title: NArray Conversion
description: A guide on how to convert NArray to Array
---

NArray can be converted back into Array, but the operation is costly so make sure that you are not using it frequently.

### get

```
Signature: get(...path: number[]): Array
```

It either returns an Array with elements or the element found at the specified path.

Calling it without any path specified will return the whole Array in the shape of an NArray.

**It is a costly function and takes more time than any other function.**

### real

You can use this property to get Array version of your NArray.

```js
import toynn from "toynn";

const myNArray = toynn.NArray.arange(32);

console.log(myNArray.real);
```
