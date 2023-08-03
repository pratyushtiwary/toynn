---
title: NArray strides
description: Guide on how NArray strides works
---

Strides define the increment for each axis.

NArray automatically computes the stride when you create an object.

You can manually change the stride.

```js
import toynn from "toynn";

const myNArray = toynn.NArray.arange(32).reshape(4, -1);

myNArray.strides = [8, 4]; // this is fine

myNArray.strides = [4]; // this is invalid
```

**Always make sure that length of strides is equals to the dimension of your NArray.**
