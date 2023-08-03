---
title: NArray dimension
description: Guide on how NArray dimensions works
---

NArray automatically computes dimension when you create an object.

You can check the dimension of your NArray using the `ndim` property.

```js
import toynn from "toynn";

const myNArray = toynn.NArray.arange(32).reshape(4, -1);

console.log(myNArray.ndim);

myNArray.ndim = 5; // ❌ invalid
```

**You can only change the dimension by [reshaping](/narray/shapes) your NArray.**
