import {
  $C,
  $E,
  classNames,
  isClassNamesArg,
  toogleClasses,
} from "../src/index.js";

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
    expect(classNames(["text-xl", " text-red-500 "])).toBe(
      "text-xl text-red-500"
    );
  });

  test("undefined or null", () => {
    expect($C(undefined)).toEqual("");
    expect($C(undefined, true)).toEqual([]);
    expect($C(null)).toEqual("");
    expect($C(null, true)).toEqual([]);
  });
});

describe("isClassNamesArg function", () => {
  test("arg == undefined or arg== null", () => {
    expect(isClassNamesArg(undefined)).toBe(true);
    expect(isClassNamesArg(null)).toBe(true);
  });

  test("arg is a string", () => {
    expect(isClassNamesArg("")).toBe(true);
    expect(isClassNamesArg("red-button")).toBe(true);
  });

  test("arg is a string array", () => {
    expect(isClassNamesArg([])).toBe(true);
    expect(isClassNamesArg(["red-button"])).toBe(true);
    expect(isClassNamesArg(["red-button", "blue-button"])).toBe(true);
    // only first element is tested
    expect(isClassNamesArg(["red-button", 22, "blue-button"])).toBe(true);
  });

  test("arg is not a ClassNamesArg", () => {
    expect(isClassNamesArg(100)).toBe(false);
    expect(isClassNamesArg([0, 1, 2])).toBe(false);
    expect(isClassNamesArg(3.14)).toBe(false);
    expect(isClassNamesArg([3.14, "red-button", "black-button"])).toBe(false);
    expect(isClassNamesArg({})).toBe(false);
  });
});

describe("toogleClasses function", () => {
  test("Basic usage", () => {
    const classesA = ["a01", "a02", "a03"];
    const classesB = ["b01", "b02"];

    const elt = $E(`<p class="b01 b03">Bla bla bla</p>`);
    expect(Array.from(elt.classList).sort()).toEqual(["b01", "b03"]);

    toogleClasses(elt, classesB, classesA);
    expect(Array.from(elt.classList).sort()).toEqual([...classesA, "b03"]);

    toogleClasses(elt, classesA, classesB);
    expect(Array.from(elt.classList).sort()).toEqual([...classesB, "b03"]);
  });

  test("Basic usage string args", () => {
    const classesA = `<foo class="a01 a02 a03"/>`;
    const classesB = `b01 b02`;

    const elt = $E(`<p class="b01 b03">Bla bla bla</p>`);
    expect(Array.from(elt.classList).sort()).toEqual(["b01", "b03"]);

    toogleClasses(elt, classesB, classesA);
    expect(Array.from(elt.classList).sort()).toEqual([
      "a01",
      "a02",
      "a03",
      "b03",
    ]);

    toogleClasses(elt, classesA, classesB);
    expect(Array.from(elt.classList).sort()).toEqual(["b01", "b02", "b03"]);
  });
});
