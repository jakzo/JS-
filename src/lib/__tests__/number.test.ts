import { digits } from "../..";

test("digits", () => {
  expect(digits(123)).toEqual([3, 2, 1]);
  expect(digits(-123)).toEqual([3, 2, 1]);
  expect(digits(123.456)).toEqual([3, 2, 1]);
  expect(digits(123, 2)).toEqual([1, 1, 0, 1, 1, 1, 1]);
});
