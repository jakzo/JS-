import { It, also, log, toJs, transform } from "../..";

describe("log", () => {
  const consoleLog = jest.spyOn(console, "log").mockImplementation();
  afterAll(() => consoleLog.mockRestore());

  test("", () => {
    expect(log(123)).toBe(123);
    expect(consoleLog).toBeCalledWith(123);

    expect(log(123, "test")).toBe(123);
    expect(consoleLog).toBeCalledWith("test", 123);

    expect(log([1, 2, 3])).toEqual([1, 2, 3]);
    expect(consoleLog).toBeCalledWith([1, 2, 3]);

    expect(log(new It([1, new It([2]), 3])).toJs()).toEqual([1, [2], 3]);
    expect(consoleLog).toBeCalledWith([1, [2], 3]);
  });
});

test("toJs", () => {
  expect(toJs(123)).toBe(123);

  expect(toJs(new It([1, new It([2]), 3]))).toEqual([1, [2], 3]);
});

test("also", () => {
  const mock = jest.fn();
  expect(also(123, mock)).toBe(123);
  expect(mock).toBeCalledWith(123);
});

test("transform", () => {
  const mock = jest.fn((n) => n * 2);
  expect(transform(123, mock)).toBe(246);
  expect(mock).toBeCalledWith(123);
});
