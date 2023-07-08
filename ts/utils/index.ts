interface LoopInput {
  start?: number;
  end: number;
  func: Function;
}

const utils = {
  forEach: (arr: Array<any>, func: Function): void => {
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        func(arr[i], i);
      },
    });
  },
  map: (arr: Array<any>, func: Function): Array<any> => {
    let f = [];
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        f.push(func(arr[i], i));
      },
    });
    return f;
  },
  reduce: (arr: Array<any>, func: Function): number => {
    let last = arr[0];
    const len = arr.length;
    utils.loop({
      start: 0,
      end: len,
      func: (i: number) => {
        last = func(last, arr[i]);
      },
    });
    return last;
  },
  loop: ({ start = 0, end, func }: LoopInput) => {
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
export default utils;