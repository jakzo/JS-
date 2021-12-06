import { JsppCommon, JsppIterable, registerExtensions } from "./prototype";

export * from ".";

registerExtensions();

declare global {
  interface Number extends JsppCommon<number> {
    /** `O(log n)` Returns a list of digits in the number in order of
     * least-to-most significance. `base` can optionally be provided.
     *
     * @example (123).digits() => [3, 2, 1]
     * (123).digits(2) => [1, 1, 0, 1, 1, 1, 1] */
    digits(base?: number): number[];
  }

  interface String extends JsppCommon<string> {}

  interface Array<T> extends JsppIterable<T, Array<T>>, JsppCommon<Array<T>> {}

  interface Map<K, V>
    extends JsppIterable<[K, V], Map<K, V>>,
      JsppCommon<Map<K, V>> {}
}
