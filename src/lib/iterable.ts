import { It, genIt } from "../It";

export const toArray = <T>(iter: Iterable<T>): T[] => [...iter];

export const mapBy = <U, S extends Iterable<unknown>>(
  iter: S,
  fn: (
    value: S extends Iterable<infer T> ? T : unknown,
    index: number,
    subject: S
  ) => U
): It<U> =>
  genIt(function* () {
    let idx = 0;
    for (const value of iter) yield fn(value as any, idx++, iter);
  });

export const fold = <U, S extends Iterable<unknown>>(
  iter: S,
  initialValue: U,
  fn: (
    accumulator: U,
    value: S extends Iterable<infer T> ? T : unknown,
    index: number,
    subject: S
  ) => U
): U => {
  let acc = initialValue;
  let i = 0;
  for (const value of iter) acc = fn(acc, value as any, i++, iter);
  return acc;
};

export const count = <S extends Iterable<unknown>>(
  iter: S,
  fn?: (
    value: S extends Iterable<infer T> ? T : unknown,
    index: number,
    subject: S
  ) => boolean
): number => {
  let c = 0;
  let i = 0;
  for (const value of iter) if (!fn || fn(value as any, i++, iter)) c++;
  return c;
};

export const sum = (iter: Iterable<number>): number =>
  fold(iter, 0, (s, v) => s + Number(v));

export const product = (iter: Iterable<number>): number =>
  fold(iter, 1, (s, v) => s * Number(v));

// TODO: Make shortcuts for functions like `count()` and `drop()` for data
//       structures like arrays where these can be done in `O(1)`
export const drop = <T>(iter: Iterable<T>, num: number): It<T> =>
  genIt(function* () {
    let i = num;
    for (const x of iter) {
      if (i-- > 0) continue;
      yield x;
    }
  });

export const nth = <T>(iter: Iterable<T>, index: number): T => {
  if (index >= 0) for (const x of drop(iter, index)) return x;
  return undefined as unknown as T;
};

export const take = <T>(iter: Iterable<T>, num: number): It<T> =>
  genIt(function* () {
    let i = num;
    for (const x of iter) {
      if (i-- <= 0) return;
      yield x;
    }
  });

export const takeExceptLast = <T>(iter: Iterable<T>, num: number): It<T> =>
  num <= 0
    ? new It(iter)
    : genIt(function* () {
        let i = 0;
        const buffer: T[] = [];
        for (const x of iter) {
          if (buffer.length >= num) yield buffer[i];
          buffer[i] = x;
          if (++i >= num) i = 0;
        }
      });

export const sliced = <T>(
  iter: Iterable<T>,
  start = 0,
  end?: number
): It<T> => {
  if (start > 0) iter = drop(iter, start);
  else if (start < 0) iter = drop(iter, count(iter) + start);
  if (end === undefined) return new It(iter);
  if (end < 0) return takeExceptLast(iter, -end);
  return take(iter, end - start);
};

export const slicesOf = <T>(iter: Iterable<T>, size: number): It<It<T>> =>
  genIt(function* () {
    let temp: T[] = [];
    for (const x of iter) {
      if (temp.length < size) temp.push(x);
      if (temp.length === size) {
        yield new It(temp);
        temp = [];
      }
    }
    if (temp.length > 0 || size === 0) yield new It(temp);
  });

export const slicesOfOverlapping = <T>(
  iter: Iterable<T>,
  size: number
): It<It<T>> =>
  genIt(function* () {
    const temp: T[] = [];
    if (size === 0) yield new It([...temp]);
    for (const x of iter) {
      temp.push(x);
      if (temp.length > size) temp.shift();
      if (temp.length === size) yield new It([...temp]);
    }
  });

export const max = <T>(iter: Iterable<T>): T => {
  let r = undefined as unknown as T;
  let isFirst = true;
  for (const x of iter)
    if (isFirst || x > r) {
      r = x;
      isFirst = false;
    }
  return r;
};

export const transpose = <T>(iter: Iterable<Iterable<T>>): It<It<T>> =>
  genIt(function* () {
    const width = max(
      mapBy(iter, (arr) => {
        if (!arr[Symbol.iterator])
          throw new TypeError("Cannot transpose because item is not iterable");
        return count(arr);
      })
    );
    for (let x = 0; x < width; x++) {
      yield genIt(function* () {
        for (const arr of iter) {
          yield nth(arr, x);
        }
      });
    }
  });

export const histogram = <T>(iter: Iterable<T>): Map<T, number> => {
  const hist = new Map<T, number>();
  for (const x of iter) hist.set(x, (hist.get(x) ?? 0) + 1);
  return hist;
};

export const reversed = <T>(iter: Iterable<T>): It<T> =>
  genIt(function* () {
    const arr = toArray(iter);
    for (let i = arr.length - 1; i >= 0; i--) yield arr[i];
  });

export const joinStr = (iter: Iterable<string>, separator = ""): string => {
  let str = "";
  let isFirst = true;
  for (const s of iter) {
    if (isFirst) isFirst = false;
    else str += separator;
    str += s;
  }
  return str;
};
