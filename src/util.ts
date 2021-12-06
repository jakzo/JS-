import * as allFuncs from "./lib/all";

export const addFuncsToPrototype = (
  proto: unknown,
  funcs: Record<string, (...args: unknown[]) => unknown>
): void => {
  for (const f of [allFuncs, funcs]) {
    for (const [name, func] of Object.entries(f)) {
      if (typeof func !== "function") continue;
      const protoFunc = function (this: unknown, ...args: unknown[]): unknown {
        return func(this, ...args);
      };
      Object.defineProperty(protoFunc, "name", { value: name });
      (proto as Record<string, unknown>)[name] = protoFunc;
    }
  }
};
