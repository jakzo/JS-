import type { JsppIterable } from "./prototype";

export interface It<T> extends JsppIterable<T, It<T>> {}
export class It<T> implements Iterable<T> {
  constructor(public iterable: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]();
  }
}

export const genIt = <T>(generator: () => Generator<T>): It<T> =>
  new It({ [Symbol.iterator]: generator });
