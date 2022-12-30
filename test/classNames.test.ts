import { classNames } from "../src/index.js";

describe("classNames function", () => {
  test("string => string[]", () => {
    expect(classNames("", true)).toStrictEqual([]);
    expect(classNames("  ", true)).toStrictEqual([]);
    expect(classNames(" \t\n", true)).toStrictEqual([]);

    expect(classNames("text-xl", true)).toStrictEqual(["text-xl"]);
    expect(classNames("text-xl text-red-500", true)).toStrictEqual([
      "text-xl",
      "text-red-500",
    ]);
  });

  test("element html string => string[]", () => {
    expect(classNames(`<a klass="aaa bbb">`, true)).toStrictEqual([]);
    expect(classNames(`<a class="aaa bbb"`, true)).toStrictEqual([
      "aaa",
      "bbb",
    ]);
    expect(classNames(`<a class="">`, true)).toStrictEqual([]);
    expect(classNames(`<a class="   aaa bbb   ccc ">`, true)).toStrictEqual([
      "aaa",
      "bbb",
      "ccc",
    ]);
  });

  test("string => string", () => {
    expect(classNames("", false)).toBe("");
    expect(classNames("  ")).toBe("");
    expect(classNames(" \t\n")).toBe("");
    expect(classNames("text-xl")).toBe("text-xl");
    expect(classNames("text-xl   text-red-500 ")).toBe("text-xl text-red-500");
  });

  test("element html string => string", () => {
    expect(classNames(`<a klass="aaa bbb">`, false)).toStrictEqual("");
    expect(classNames(`<a class="aaa bbb"`, false)).toStrictEqual("aaa bbb");
    expect(classNames(`<a class="">`)).toStrictEqual("");
    expect(classNames(`<a class="   aaa bbb   ccc ">`)).toStrictEqual(
      "aaa bbb ccc"
    );
  });

  test("string[] => string", () => {
    expect(classNames([], false)).toBe("");
    expect(classNames(["  "])).toBe("");
    expect(classNames([" \t\n"])).toBe("");
    expect(classNames([" text-xl"])).toBe("text-xl");
    expect(classNames(["text-xl", " text-red-500 "])).toBe("text-xl text-red-500");
  });
});
