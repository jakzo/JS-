import { It } from "./It";
import type { ToJs } from "./lib/all";
import * as iterFuncs from "./lib/iterable";
import * as numberFuncs from "./lib/number";
import * as stringFuncs from "./lib/string";
import { addFuncsToPrototype } from "./util";

export const registerExtensions = (): void => {
  const constructors: [
    new (...args: unknown[]) => unknown,
    Record<string, (...args: unknown[]) => unknown>
  ][] = [
    [Number, numberFuncs],
    [String, stringFuncs],
    [Array, {}],
    [Map, {}],
  ];
  for (const [constructor, funcs] of constructors) {
    const prototype = constructor.prototype as { [Symbol.iterator]?: unknown };
    if (!prototype[Symbol.iterator])
      prototype[Symbol.iterator] = function* () {
        yield this;
      };
    addFuncsToPrototype(prototype, iterFuncs);
    addFuncsToPrototype(prototype, funcs);
  }
  setupItPrototype();
};

export const setupItPrototype = (): void => {
  addFuncsToPrototype(It.prototype, iterFuncs);
};

export interface JsppCommon<T> {
  /** `O(n)` Calls `console.log()` on the value with an optional message.
   *
   * @example [1, 2, 3].log() => [1, 2, 3]
   * [1, 2, 3].log("Result:") => Result: [1, 2, 3] */
  log(message?: string): T;

  /** `O(n)` Converts the value from JS++ data structures to standard JS data
   * structures. Converts nested values.
   *
   * @example primes().upTo(10).toJs() => [2, 3, 5, 7] */
  toJs(): ToJs<T>;

  /** `O(1)` Calls `fn` with value to perform side-effects, then returns the
   * value unchanged.
   *
   * @example "hello".also(str => saveToFile(str)) => "hello" */
  also(fn: (value: T) => void): T;

  /** `O(1)` Calls `fn` with the value and returns the transformed result.
   *
   * @example "hello".transform(str => str.toUpperCase()) => "HELLO" */
  transform<U>(func: (value: T) => U): U;

  /** `O(1)` Returns the `defaultValue` if the value is `undefined` or `null`.
   *
   * @example "test".or("other") => "test"
   * undefined.or("other") => "other"
   */
  // Uhhhhh...
  or<U>(defaultValue: U): NonNullable<T> | U;
}

export interface JsppIterable<T, S = Iterable<T>> extends JsppCommon<T> {
  /** `O(n)` Converts the iterable into a standard JS array.
   *
   * @example primes().upTo(10).toArray() => [2, 3, 5, 7] */
  toArray(): T[];

  /** `O(n)` Returns an iterable with each value mapped to another.
   *
   * @example [1, 2, 3].mapBy(n => n * 2) => [2, 4, 6] */
  mapBy<U>(fn: (value: T, index: number, subject: S) => U): It<U>;

  /** `O(n)` Similar to JS `reduce`. Accumulates all values into a single value.
   *
   * @example [1, 2, 3].fold(0, (sum, n) => sum + n) => 6 */
  fold<U>(
    initialValue: U,
    fn: (accumulator: U, value: T, index: number, subject: S) => U
  ): It<U>;

  /** `O(n)` Counts the number of values which match the predicate. If `predicate`
   * is not given, returns the total number of values in the iterable.
   *
   * @example [1, 2, 3].count(n => n % 2 === 1) => 2
   * primes().upTo(10).count() => 4 */
  count(predicate?: (value: T, index: number, subject: S) => boolean): It<T>;

  /** `O(n)` Casts every value to a number and adds them all together.
   *
   * @example [1, 2, 3, 4].sum() => 10 */
  sum(): number;

  /** `O(n)` Casts every value to a number and multiplies them all together.
   *
   * @example [1, 2, 3, 4].product() => 24 */
  product(): number;

  /** `O(index)` Returns the element at the specified `index`.
   *
   * @example ["x", "y", "z"].nth(2) => "z" */
  nth(index: number): T;

  /** `O(n)` Returns an iterable missing the first `num` elements.
   *
   * @example [1, 2, 3, 4].drop(2) => [3, 4] */
  drop(num: number): It<T>;

  /** `O(num)` Returns an iterable of the first `num` elements.
   *
   * @example [1, 2, 3, 4].take(2) => [1, 2] */
  take(num: number): It<T>;

  /** `O(n)` Returns an iterable of all elements except the last `num` elements.
   *
   * @example [1, 2, 3, 4].takeExceptLast(1) => [1, 2, 3] */
  takeExceptLast(num: number): It<T>;

  /** `O(n)` Returns an iterable of all items at indexes between `start` and `end`.
   * Negative values of `start` and `end` go from the end like `length - value`.
   * `start` defaults to 0. `end` defaults to the length of the iterable.
   *
   * @example [1, 2, 3, 4].sliced(1, 3) => [2, 3]
   * [1, 2, 3, 4].sliced(0, -1) => [1, 2, 3]
   * [1, 2, 3, 4].sliced(-3) => [2, 3, 4]
   * [1, 2, 3, 4].sliced(1) => [2, 3, 4]
   * [1, 2, 3, 4].sliced() => [1, 2, 3, 4] */
  sliced(start?: number, end?: number): It<T>;

  /** `O(n)` Splits the iterable into sublists of `size`. The last list may not
   * have length `size`.
   *
   * @example [1, 2, 3, 4, 5].slicesOf(2) => [[1, 2], [3, 4], [5]] */
  slicesOf(size: number): It<It<T>>;

  /** `O(n*size)` Returns a list of each slice of length `size` with slices
   * allowed to overlap other slices.
   *
   * @example [1, 2, 3, 4].slicesOfOverlapping(2) => [[1, 2], [2, 3], [3, 4]] */
  slicesOfOverlapping(size: number): It<It<T>>;

  /** `O(n)` Returns the maximal item in the iterable.
   *
   * @example [4, 6, 3, 5].max() => 6
   * ["a", "s", "d", "f"].max() => "s"
   */
  max(): T;

  /** `O(m*n)` Swaps the rows and columns of the source iterable.
   *
   * ```js
   *                   0:   1:   2:
   * 0: [1, 2, 3],    [ 1| [ 2| [ 3|
   * 1: [4, 5, 6], ->  |4|  |5|  |6|
   * 2: [7, 8, 9],     |7 ] |8 ] |9 ]
   * ```
   *
   * @example [[1, 2, 3], [4, 5, 6]].transpose() => [[1, 4], [2, 5], [3, 6]] */
  transpose(): It<It<T>>;

  /** `O(n)` Returns a map of values to the number of times they appear.
   *
   * @example ["a", "b", "a", "c", "c", "c"].histogram() => { a: 2, b: 1, b: 3 } */
  histogram(): Map<T, number>;

  /** `O(n)` Returns the iterable reversed.
   *
   * @example [1, 2, 3].reversed() => [3, 2, 1] */
  reversed(): It<T>;

  /** `O(n)` Returns a string of all items concatenated, optionally with a
   * separator string between items.
   *
   * @example ["x", "y", "z"].joinStr() => "xyz"
   * ["x", "y", "z"].joinStr(".") => "x.y.z"
   */
  joinStr(separator?: string): string;
}
