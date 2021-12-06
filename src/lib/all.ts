import { It } from "../It";
import { mapBy } from "./iterable";

export const log = <T>(value: T, message?: string): T => {
  const logged = toJs(value);
  console.log(...(message === undefined ? [logged] : [message, logged]));
  return value;
};

export type ToJs<T> = T extends It<infer V> ? ToJs<V>[] : T;
export const toJs = <T>(value: T): ToJs<T> =>
  (value instanceof It ? mapBy(value, toJs).toArray() : value) as ToJs<T>;

export const also = <T>(value: T, func: (value: T) => void): T => {
  func(value);
  return value;
};

export const transform = <T, U>(value: T, func: (value: T) => U): U =>
  func(value);

export const or = <T, U>(value: T, other: U): NonNullable<T> | U =>
  value ?? other;
