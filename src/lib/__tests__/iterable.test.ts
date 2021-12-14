import { It } from "../..";

test("mapBy", () => {
  const it = new It([1, 2, 3]);
  const fn = jest.fn((n) => n * 2);
  expect(it.mapBy(fn).toJs()).toEqual([2, 4, 6]);
  expect(fn.mock.calls).toEqual([
    [1, 0, it],
    [2, 1, it],
    [3, 2, it],
  ]);
});

test("filterBy", () => {
  const it = new It([1, 2, 3]);
  const fn = jest.fn((n) => n % 2 === 1);
  expect(it.filterBy(fn).toJs()).toEqual([1, 3]);
  expect(fn.mock.calls).toEqual([
    [1, 0, it],
    [2, 1, it],
    [3, 2, it],
  ]);
});

test("fold", () => {
  const it = new It([1, 2, 3]);
  const fn = jest.fn((v, n) => v * n);
  expect(it.fold(4, fn)).toBe(24);
  expect(fn.mock.calls).toEqual([
    [4, 1, 0, it],
    [4, 2, 1, it],
    [8, 3, 2, it],
  ]);
});

test("count", () => {
  const it = new It([1, 2, 3]);
  const fn = jest.fn((n) => n % 2 === 1);
  expect(it.count(fn)).toBe(2);
  expect(fn.mock.calls).toEqual([
    [1, 0, it],
    [2, 1, it],
    [3, 2, it],
  ]);

  expect(new It([false, true, true, null, undefined]).count()).toBe(5);
});

test("sum", () => {
  expect(new It([1, 2, 3]).sum()).toBe(6);
  expect(new It([]).sum()).toBe(0);
  expect(new It([3, "x"]).sum()).toBe(NaN);
  expect(new It([3n, 4n]).sum()).toBe(7);
});

test("product", () => {
  expect(new It([1, 2, 3, 4]).product()).toBe(24);
  expect(new It([]).product()).toBe(1);
  expect(new It([3, "x"]).product()).toBe(NaN);
  expect(new It([3n, 4n]).product()).toBe(12);
});

test("nth", () => {
  expect(new It([1, 2, 3, 4, 5]).nth(2)).toBe(3);
  expect(new It([1, 2, 3, 4, 5]).nth(0)).toBe(1);
  expect(new It([1, 2, 3, 4, 5]).nth(4)).toBe(5);
  expect(new It([1, 2, 3, 4, 5]).nth(5)).toBe(undefined);
  expect(new It([1, 2, 3, 4, 5]).nth(-1)).toBe(undefined);
});

test("first", () => {
  expect(new It(["x", "y", "z"]).first()).toBe("x");
  expect(new It([]).first()).toBe(undefined);
});

test("last", () => {
  expect(new It(["x", "y", "z"]).last()).toBe("z");
  expect(new It([]).last()).toBe(undefined);
});

test("drop", () => {
  expect(new It([1, 2, 3, 4, 5]).drop(2).toJs()).toEqual([3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).drop(5).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).drop(6).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).drop(0).toJs()).toEqual([1, 2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).drop(-1).toJs()).toEqual([1, 2, 3, 4, 5]);
});

test("take", () => {
  expect(new It([1, 2, 3, 4, 5]).take(2).toJs()).toEqual([1, 2]);
  expect(new It([1, 2, 3, 4, 5]).take(5).toJs()).toEqual([1, 2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).take(6).toJs()).toEqual([1, 2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).take(0).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).take(-1).toJs()).toEqual([]);
});

test("takeExceptLast", () => {
  expect(new It([1, 2, 3, 4, 5]).takeExceptLast(2).toJs()).toEqual([1, 2, 3]);
  expect(new It([1, 2, 3, 4, 5]).takeExceptLast(5).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).takeExceptLast(6).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).takeExceptLast(0).toJs()).toEqual([
    1, 2, 3, 4, 5,
  ]);
  expect(new It([1, 2, 3, 4, 5]).takeExceptLast(-1).toJs()).toEqual([
    1, 2, 3, 4, 5,
  ]);
});

test("sliced", () => {
  expect(new It([1, 2, 3, 4, 5]).sliced(1, 4).toJs()).toEqual([2, 3, 4]);
  expect(new It([1, 2, 3, 4, 5]).sliced(1, 5).toJs()).toEqual([2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).sliced(1, 6).toJs()).toEqual([2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).sliced(3, 3).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).sliced(3, 1).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).sliced(0, 4).toJs()).toEqual([1, 2, 3, 4]);
  expect(new It([1, 2, 3, 4, 5]).sliced(1, -1).toJs()).toEqual([2, 3, 4]);
  expect(new It([1, 2, 3, 4, 5]).sliced(-3, -1).toJs()).toEqual([3, 4]);
  expect(new It([1, 2, 3, 4, 5]).sliced(-1, -3).toJs()).toEqual([]);
  expect(new It([1, 2, 3, 4, 5]).sliced(-3).toJs()).toEqual([3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).sliced(-6).toJs()).toEqual([1, 2, 3, 4, 5]);
  expect(new It([1, 2, 3, 4, 5]).sliced().toJs()).toEqual([1, 2, 3, 4, 5]);
});

test("slicesOf", () => {
  expect(new It([1, 2, 3, 4, 5, 6]).slicesOf(3).toJs()).toEqual([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  expect(new It([1, 2, 3, 4, 5]).slicesOf(2).toJs()).toEqual([
    [1, 2],
    [3, 4],
    [5],
  ]);
  expect(new It([1, 2, 3]).slicesOf(0).toJs()).toEqual([[], [], [], []]);
});

test("slicesOfOverlapping", () => {
  expect(new It([1, 2, 3, 4, 5, 6]).slicesOfOverlapping(3).toJs()).toEqual([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
  ]);
  expect(new It([1, 2, 3]).slicesOfOverlapping(0).toJs()).toEqual([
    [],
    [],
    [],
    [],
  ]);
});

test("max", () => {
  expect(new It([4, 6, 3, 5]).max()).toBe(6);
  expect(new It(["a", "s", "d", "f"]).max()).toBe("s");
  expect(new It([{}, 2]).max()).toEqual({});
  expect(new It([2, {}]).max()).toBe(2);
  expect(new It([]).max()).toBe(undefined);
});

test("fromDigits", () => {
  expect(new It([3, 2, 1]).fromDigits()).toBe(123);
  expect(new It([0, 0, 1]).fromDigits(2)).toBe(4);
  expect(new It([]).fromDigits()).toBe(0);
});

test("transpose", () => {
  expect(
    new It([
      [1, 2, 3],
      [4, 5, 6],
    ])
      .transpose()
      .toJs()
  ).toEqual([
    [1, 4],
    [2, 5],
    [3, 6],
  ]);
  expect(
    new It([
      [1, 2, 3],
      [4, 5],
      [7, 8, 9],
    ])
      .transpose()
      .toJs()
  ).toEqual([
    [1, 4, 7],
    [2, 5, 8],
    [3, undefined, 9],
  ]);
  expect(new It([[], [], []]).transpose().toJs()).toEqual([]);
  expect(() => new It([[1, 2, 3], 5, [7, 8, 9]]).transpose().toJs()).toThrow();
});

test("histogram", () => {
  expect(new It(["a", "b", "a", "c", "c", "c"]).histogram()).toEqual(
    new Map([
      ["a", 2],
      ["b", 1],
      ["c", 3],
    ])
  );
});

test("reversed", () => {
  expect(new It([1, 2, 3]).reversed().toJs()).toEqual([3, 2, 1]);
});

test("joinStr", () => {
  expect(new It(["x", "y", "z"]).joinStr()).toBe("xyz");
  expect(new It(["x", "y", "z"]).joinStr(".")).toBe("x.y.z");
  expect(new It([1, 2, 3]).joinStr()).toBe("123");
  expect(new It([]).joinStr()).toBe("");
});

test("permutations", () => {
  expect(new It([1, 2, 3]).permutations().toJs()).toEqual([
    [1, 2, 3],
    [2, 1, 3],
    [3, 1, 2],
    [1, 3, 2],
    [2, 3, 1],
    [3, 2, 1],
  ]);
});

test("sorted", () => {
  expect(new It([3, 1, 2, 5, 4]).sorted().toJs()).toEqual([1, 2, 3, 4, 5]);
  expect(new It([3, 22, 111]).sorted().toJs()).toEqual([3, 22, 111]);
  expect(new It(["y", "z", "x"]).sorted().toJs()).toEqual(["x", "y", "z"]);
  expect(new It([3, "2", 1]).sorted().toJs()).toEqual([1, 3, "2"]);
  expect(new It([4, "2", 3n, 1]).sorted().toArray().join(",")).toEqual(
    [1, 3n, 4, "2"].join(",")
  );
  expect(
    new It([
      "2",
      {},
      [],
      Symbol.for("x"),
      {},
      "0",
      true,
      false,
      null,
      undefined,
      44,
      5,
      2,
    ])
      .sorted()
      .toJs()
  ).toEqual([
    false,
    true,
    2,
    5,
    44,
    "0",
    "2",
    {},
    [],
    Symbol.for("x"),
    {},
    null,
    undefined,
  ]);

  expect(
    new It([3, 1, 2, 5, 4]).sorted((n) => [3, 1, 5, 2, 4].indexOf(n)).toJs()
  ).toEqual([3, 1, 5, 2, 4]);
  expect(
    new It([3, 1, 2, 5, 4]).sorted(undefined, (a, b) => b - a).toJs()
  ).toEqual([5, 4, 3, 2, 1]);
});
