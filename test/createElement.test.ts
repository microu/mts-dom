import { createElement, $E, namespaceURI } from "../src";

test("$E is createElement", () => {
  expect($E).toBe(createElement);
});

describe("createElement - string arg call patterns", () => {
  test("create <p> element from text", () => {
    const elt = createElement("One, two, three.");
    expect(elt.tagName).toEqual("P");
    expect(elt.textContent).toEqual("One, two, three.");
    expect(elt.namespaceURI).toEqual(namespaceURI.xhtml);
    expect(elt.childNodes.length).toEqual(1);
    expect(elt.firstChild).toBeInstanceOf(Text);
    expect(elt.children.length).toEqual(0);
  });

  test("create from html no wrap", () => {
    const elt = $E(`
    <ul>
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
    </ul>
    `);
    expect(elt.tagName).toEqual("UL");
    expect(elt.namespaceURI).toEqual(namespaceURI.xhtml);
    expect(elt.childNodes.length).toEqual(3);
    expect(elt.children.length).toEqual(3);
    expect(elt.children[0].textContent).toEqual("One");
    expect(elt.children[1].textContent).toEqual("Two");
    expect(elt.children[2].textContent).toEqual("Three");
  });

  test("create from html wrap with div", () => {
    const elt = $E(`
    <p>One</p>
    <p>Two</p>
    <p>Three</p>
    `);
    expect(elt.tagName).toEqual("DIV");
    expect(elt.namespaceURI).toEqual(namespaceURI.xhtml);
    expect(elt.childNodes.length).toEqual(3);
    expect(elt.children.length).toEqual(3);
    expect(elt.children[0].textContent).toEqual("One");
    expect(elt.children[1].textContent).toEqual("Two");
    expect(elt.children[2].textContent).toEqual("Three");
  });

  test("Create <svg> element", () => {
    const svg = `<svg width="200" height="200" viewbox="0 0 1 1">
      <rect x=".25", y=".25" width="0.5", height="0.5"/>
      <circle cx=".5", cy=".5" r="0.3"/>
    </svg>`;

    const elt = createElement(svg);
    expect(elt.tagName).toEqual("svg");
    expect(elt.namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.childNodes.length).toEqual(2);
    expect(elt.children.length).toEqual(2);
    expect(elt.children[0].tagName).toEqual("rect");
    expect(elt.children[0].namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.children[1].tagName).toEqual("circle");
    expect(elt.children[1].namespaceURI).toEqual(namespaceURI.svg);
  });

  test("Create svg <g> element", () => {
    const svg = `!svg!
    <g>
      <rect x=".25", y=".25" width="0.5", height="0.5"/>
      <circle cx=".5", cy=".5" r="0.3"/>
    </g>`;

    const elt = createElement(svg);
    expect(elt.tagName).toEqual("g");
    expect(elt.namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.childNodes.length).toEqual(2);
    expect(elt.children.length).toEqual(2);
    expect(elt.children[0].tagName).toEqual("rect");
    expect(elt.children[0].namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.children[1].tagName).toEqual("circle");
    expect(elt.children[1].namespaceURI).toEqual(namespaceURI.svg);
  });

  test("Create svg <g> (autowrap) element", () => {
    const svg = `!svg!<rect x=".25", y=".25" width="0.5", height="0.5"/>
      <circle cx=".5", cy=".5" r="0.3"/>`;

    const elt = createElement(svg);
    expect(elt.tagName).toEqual("g");
    expect(elt.namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.childNodes.length).toEqual(2);
    expect(elt.children.length).toEqual(2);
    expect(elt.children[0].tagName).toEqual("rect");
    expect(elt.children[0].namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.children[1].tagName).toEqual("circle");
    expect(elt.children[1].namespaceURI).toEqual(namespaceURI.svg);
  });
});

describe("createElement - Element arg", () => {
  test("Basic usage html", () => {
    const elt0 = document.createElement("div");
    expect($E(elt0)).toBe(elt0);
    expect($E(elt0).tagName).toBe("DIV");
    expect($E(elt0).namespaceURI).toBe(namespaceURI.xhtml);
  });

  test("Basic usage svg", () => {
    const elt0 = document.createElementNS(namespaceURI.svg, "g");
    expect($E(elt0)).toBe(elt0);
    expect($E(elt0).tagName).toBe("g");
    expect($E(elt0).namespaceURI).toBe(namespaceURI.svg);
  });
});
describe("createElement - object arg call html/svg patterns", () => {
  test("create <p> element from html", () => {
    const elt = $E({ html: "<p>One, two, three.</p>" });
    expect(elt.tagName).toEqual("P");
    expect(elt.textContent).toEqual("One, two, three.");
    expect(elt.namespaceURI).toEqual(namespaceURI.xhtml);
    expect(elt.childNodes.length).toEqual(1);
    expect(elt.firstChild).toBeInstanceOf(Text);
    expect(elt.children.length).toEqual(0);
  });

  test("create <div> (auto wrapper) element from html", () => {
    const elt = $E({
      html: `
      <p>One</p>
      <p>Two</p>
      <p>Three</p>
    `,
    });
    expect(elt.tagName).toEqual("DIV");
    expect(elt.namespaceURI).toEqual(namespaceURI.xhtml);
    expect(elt.childNodes.length).toEqual(3);
    expect(elt.children.length).toEqual(3);
    expect(elt.children[0].textContent).toEqual("One");
    expect(elt.children[1].textContent).toEqual("Two");
    expect(elt.children[2].textContent).toEqual("Three");
  });

  test("create <svg>element from svg", () => {
    const elt = $E({
      svg: `
      <g>
      <path d="M 0 0 L 100 100"/>
      <circle cx="50" cy="50" r="33"/>
      <rect x="20" cy="20" width="75" , height="50"/>
      </g>
    `,
    });
    expect(elt.tagName).toEqual("g");
    expect(elt.namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.childNodes.length).toEqual(3);
    expect(elt.children.length).toEqual(3);
    expect(elt.children[0].tagName).toEqual("path");
    expect(elt.children[0].namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.children[1].tagName).toEqual("circle");
    expect(elt.children[1].namespaceURI).toEqual(namespaceURI.svg);
    expect(elt.children[2].tagName).toEqual("rect");
    expect(elt.children[2].namespaceURI).toEqual(namespaceURI.svg);
  });

  test("no html + no svg => Error", () => {
    expect(() => {
      createElement({});
    }).toThrow();
  });
});
