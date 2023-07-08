"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arrayUtils = {
    forEach: (arr, func) => {
        const len = arr.length;
        for (let i = 0; i < len; i += 10) {
            func(arr[i], i);
            if (i + 1 < len) {
                func(arr[i + 1], i + 1);
            }
            if (i + 2 < len) {
                func(arr[i + 2], i + 2);
            }
            if (i + 3 < len) {
                func(arr[i + 3], i + 3);
            }
            if (i + 4 < len) {
                func(arr[i + 4], i + 4);
            }
            if (i + 5 < len) {
                func(arr[i + 5], i + 5);
            }
            if (i + 6 < len) {
                func(arr[i + 6], i + 6);
            }
            if (i + 7 < len) {
                func(arr[i + 7], i + 7);
            }
            if (i + 8 < len) {
                func(arr[i + 8], i + 8);
            }
            if (i + 9 < len) {
                func(arr[i + 9], i + 9);
            }
            if (i + 10 < len) {
                func(arr[i + 10], i + 10);
            }
        }
    },
    map: (arr, func) => {
        let f = [];
        const len = arr.length;
        for (let i = 0; i < len; i += 11) {
            f.push(func(arr[i], i));
            if (i + 1 < len) {
                f.push(func(arr[i + 1], i + 1));
            }
            if (i + 2 < len) {
                f.push(func(arr[i + 2], i + 2));
            }
            if (i + 3 < len) {
                f.push(func(arr[i + 3], i + 3));
            }
            if (i + 4 < len) {
                f.push(func(arr[i + 4], i + 4));
            }
            if (i + 5 < len) {
                f.push(func(arr[i + 5], i + 5));
            }
            if (i + 6 < len) {
                f.push(func(arr[i + 6], i + 6));
            }
            if (i + 7 < len) {
                f.push(func(arr[i + 7], i + 7));
            }
            if (i + 8 < len) {
                f.push(func(arr[i + 8], i + 8));
            }
            if (i + 9 < len) {
                f.push(func(arr[i + 9], i + 9));
            }
            if (i + 10 < len) {
                f.push(func(arr[i + 10], i + 10));
            }
        }
        return f;
    },
    reduce: (arr, func) => {
        let last = arr[0];
        const len = arr.length;
        for (let i = 1; i < len; i += 11) {
            last = func(last, arr[i]);
            if (i + 1 < len) {
                last = func(last, arr[i + 1]);
            }
            if (i + 2 < len) {
                last = func(last, arr[i + 2]);
            }
            if (i + 3 < len) {
                last = func(last, arr[i + 3]);
            }
            if (i + 4 < len) {
                last = func(last, arr[i + 4]);
            }
            if (i + 5 < len) {
                last = func(last, arr[i + 5]);
            }
            if (i + 6 < len) {
                last = func(last, arr[i + 6]);
            }
            if (i + 7 < len) {
                last = func(last, arr[i + 7]);
            }
            if (i + 8 < len) {
                last = func(last, arr[i + 8]);
            }
            if (i + 9 < len) {
                last = func(last, arr[i + 9]);
            }
            if (i + 10 < len) {
                last = func(last, arr[i + 10]);
            }
        }
        return last;
    },
    loop: ({ start = 0, end, func }) => {
        const len = end;
        for (let i = start; i < end; i += 11) {
            func(i);
            if (i + 1 < len) {
                func(i + 1);
            }
            if (i + 2 < len) {
                func(i + 2);
            }
            if (i + 3 < len) {
                func(i + 3);
            }
            if (i + 4 < len) {
                func(i + 4);
            }
            if (i + 5 < len) {
                func(i + 5);
            }
            if (i + 6 < len) {
                func(i + 6);
            }
            if (i + 7 < len) {
                func(i + 7);
            }
            if (i + 8 < len) {
                func(i + 8);
            }
            if (i + 9 < len) {
                func(i + 9);
            }
            if (i + 10 < len) {
                func(i + 10);
            }
        }
    },
};
exports.default = arrayUtils;
//# sourceMappingURL=index.js.map