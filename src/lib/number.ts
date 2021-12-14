import { It, genIt } from "../It";

export const digits = (num: number, base = 10): It<number> =>
  genIt(function* () {
    for (let n = Math.floor(Math.abs(num)); n > 0; n = Math.floor(n / base))
      yield n % base;
  });

export const to = (
  num: number,
  max: number,
  step = 1,
  isInclusive = true
): It<number> =>
  genIt(function* () {
    for (let i = num; isInclusive ? i <= max : i < max; i += step) yield i;
  });
