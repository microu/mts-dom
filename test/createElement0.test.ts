import {createElement0, $E0, namespaceURI } from "../src/index.js";

describe("createElement create from tag", () => {
  test("$E is createElement", () => {
    expect($E0).toBe(createElement0);
  });

  test("$E with and without namespace", () => {
    let elt = $E0(":p");
    expect(elt.tagName).toBe("P");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);

    elt = $E0(":svg");
    expect(elt.tagName).toBe("SVG");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);

    elt = $E0({ tag: "svg", namespace: namespaceURI.svg });
    expect(elt.tagName).toBe("svg");
    expect(elt.namespaceURI).toBe(namespaceURI.svg);

    elt = $E0({ tag: "SVG", namespace: namespaceURI.svg });
    expect(elt.tagName).toBe("SVG");
    expect(elt.namespaceURI).toBe(namespaceURI.svg);

    elt = $E0({ tag: "SVG", namespace: "!svg" });
    expect(elt.tagName).toBe("SVG");
    expect(elt.namespaceURI).toBe(namespaceURI.svg);
  });

  test("$E empty div element from html", () => {
    let elt = $E0(`<div class="flex"></div>`);
    expect(elt.tagName).toBe("DIV");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.children.length).toBe(0);
  });

  test("$E from attribute shorcuts+ text", () => {
    let elt = $E0(":p");
    expect(elt.tagName).toBe("P");
    expect(elt.children.length).toBe(0);

    elt = $E0(":p:Hello");
    expect(elt.tagName).toBe("P");
    expect(elt.textContent).toBe("Hello");
  });

  test("$E with attributes", () => {
    let elt = $E0({
      tag: "a",
      attributes: {
        href: "https://truc.microu.org",
      },
    });

    expect(elt.tagName).toBe("A");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(0);
    expect(elt.getAttributeNames()).toEqual(["href"]);
    expect(elt.getAttribute("href")).toBe("https://truc.microu.org");

    elt = $E0({
      tag: "img",
      attributes: {
        href: "https://truc.microu.org/image.svg",
        label: "SVG image",
      },
    });
    expect(elt.tagName).toBe("IMG");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(0);
    expect(elt.getAttributeNames().sort()).toEqual(["href", "label"]);
    expect(elt.getAttribute("href")).toBe("https://truc.microu.org/image.svg");
    expect(elt.getAttribute("label")).toBe("SVG image");
  });

  test("$E with text", () => {
    let elt = $E0({
      tag: "a",
      attributes: {
        href: "https://truc.microu.org",
      },
      text: "Interesting!",
    });
    expect(elt.tagName).toBe("A");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(1);
    expect(elt.children.length).toBe(0);
    expect(elt.getAttributeNames()).toEqual(["href"]);
    expect(elt.getAttribute("href")).toBe("https://truc.microu.org");
    expect(elt.textContent).toBe("Interesting!");
  });

  test("$E with text", () => {
    let elt = $E0({
      tag: "a",
      attributes: {
        href: "https://truc.microu.org",
      },
      text: "Interesting!",
    });
    expect(elt.tagName).toBe("A");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(1);
    expect(elt.children.length).toBe(0);
    expect(elt.getAttributeNames()).toEqual(["href"]);
    expect(elt.getAttribute("href")).toBe("https://truc.microu.org");
    expect(elt.textContent).toBe("Interesting!");
  });

  test("$E with children", () => {
    const n = 10;
    let elt = $E0({
      tag: "ul",
      attributes: { class: "counter" },
      children: Array.from(new Array(n), (_v, i) => `<li>${i}</li>`),
    });
    checkULCounter(n, elt);
  });

  test("$E with children as text", () => {
    const n = 100;
    let childrenHTML = Array.from(new Array(n), (_, i) => `  <li>${i}</li>`).join("\n");

    let elt = $E0({
      tag: "ul",
      attributes: { class: "counter" },
      children: childrenHTML,
    });
    checkULCounter(n, elt);
  });

  test("$E with classes option", () => {
    let elt = $E0({
      tag: "a",
      attributes: { href: "https://microu.org/", label: "microu", class: "aaa bbb ccc" },
      classes: ["ccc", "ddd", "eee"],
    });
    expect(elt.tagName).toBe("A");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(0);
    expect(elt.children.length).toBe(0);
    expect(elt.getAttributeNames().sort()).toEqual(["class", "href", "label"]);
    expect(elt.getAttribute("href")).toBe("https://microu.org/");
    expect(elt.getAttribute("label")).toBe("microu");
    expect(Array.from(elt.classList).sort()).toEqual(["aaa", "bbb", "ccc", "ddd", "eee"]);
  });
});

describe("createElement(arg, attributes?, children?)", () => {
  test("createElement(arg, attributes)", () => {
    const elt = createElement0(":a", { href: "https://microu.org/", label: "microu" });
    expect(elt.tagName).toBe("A");
    expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
    expect(elt.childNodes.length).toBe(0);
    expect(elt.children.length).toBe(0);
    expect(elt.getAttributeNames().sort()).toEqual(["href", "label"]);
    expect(elt.getAttribute("href")).toBe("https://microu.org/");
    expect(elt.getAttribute("label")).toBe("microu");
  });

  test("createElement(arg, undefined, children)", () => {
    const n = 33;
    const elt = $E0(
      ":UL",
      null,
      Array.from(new Array(n), (_, i) => $E0(`<li>${i}</li>`))
    );
    checkULCounter(n, elt);
  });

  test("createElement(arg, attributes, children)", () => {
    const n = 16;
    const elt = $E0(
      ":UL",
      { id: "counter", name: "counter list" },
      Array.from(new Array(n), (_, i) => $E0(`<li>${i}</li>`))
    );
    checkULCounter(n, elt);
    expect(elt.getAttribute("id")).toBe("counter");
    expect(elt.getAttribute("name")).toBe("counter list");
  });
});

function checkULCounter(n: number, elt: Element) {
  expect(elt.tagName).toBe("UL");
  expect(elt.namespaceURI).toBe(namespaceURI.xhtml);
  expect(elt.childNodes.length).toBe(n);
  expect(elt.children.length).toBe(n);
  expect(Array.from(elt.children).map((e) => e.tagName)).toEqual(new Array(n).fill("LI"));
  expect(Array.from(elt.children).map((e) => parseInt(e.textContent!))).toEqual(
    Array.from(new Array(n), (_, i) => i)
  );
}
