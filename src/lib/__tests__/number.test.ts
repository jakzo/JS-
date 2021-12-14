import { digits, to } from "../..";

test("digits", () => {
  expect(digits(123).toJs()).toEqual([3, 2, 1]);
  expect(digits(-123).toJs()).toEqual([3, 2, 1]);
  expect(digits(123.456).toJs()).toEqual([3, 2, 1]);
  expect(digits(123, 2).toJs()).toEqual([1, 1, 0, 1, 1, 1, 1]);
});

test("to", () => {
  expect(to(3, 6).toJs()).toEqual([3, 4, 5, 6]);
  expect(to(3, 5.5).toJs()).toEqual([3, 4, 5]);
  expect(to(3, 3).toJs()).toEqual([3]);
  expect(to(3, 2).toJs()).toEqual([]);
  expect(to(-3, -1).toJs()).toEqual([-3, -2, -1]);
  expect(to(-3, -4).toJs()).toEqual([]);
  expect(to(3, 9, 3).toJs()).toEqual([3, 6, 9]);
  expect(to(3, 6, undefined, false).toJs()).toEqual([3, 4, 5]);
});
