import {
  cleanupChildNodes,
  fragmentFromHTML,
  fragmentFromSVG,
  namespaceURI,
  NodeFilters,
  removeAllChildren,
  wrapDocumentFragment,
  wrapSVGFragment,
  $E,
} from "../src/index.js";

//======
describe("cleanupChildNodes", () => {
  test("default cleanup (non HtmlElement and non blank text)", () => {
    const df = fragmentFromHTML(`
    aaa
    <header></header>
    <div></div>
    bbbb
    <footer></footer>
    `);
    expect(df.childNodes.length).toBeGreaterThan(5);
    expect(df.children.length).toBe(3);
    cleanupChildNodes(df);
    expect(df.childNodes.length).toBe(5);
    expect(df.children.length).toBe(3);
  });

  test("keep HTML Element", () => {
    const df = fragmentFromHTML(`
    aaa
    <header>HEADER</header>
    bbbb
    <article>ARTICLE</article>
    cccc
    <footer>FOOTER</footer>
    ddddd
    `);
    expect(df.childNodes.length).toBeGreaterThanOrEqual(7);
    expect(df.children.length).toBe(3);

    cleanupChildNodes(df, NodeFilters.element);
    expect(df.childNodes.length).toBe(3);
    expect(df.children.length).toBe(3);
    for (let i = 0; i < df.children.length; i += 1) {
      let child = df.children[i];
      expect(child.tagName).toBe(child.textContent);
    }
  });

  test("custom cleanup", () => {
    const df = fragmentFromHTML(`
    <header></header>
    aaaa
    <div></div>
    bbbb
    <p></p>
    cccc
    <div></div>
    <footer></footer>
    `);
    expect(df.childNodes.length).toBeGreaterThan(8);
    expect(df.children.length).toBe(5);

    cleanupChildNodes(df);
    expect(df.childNodes.length).toBe(8);
    expect(df.children.length).toBe(5);

    cleanupChildNodes(df, (n) => {
      return n instanceof HTMLElement && n.tagName != "DIV";
    });
    expect(df.childNodes.length).toBe(3);
    expect(df.children.length).toBe(3);
  });

  test("SVG cleanup", () => {
    const df = fragmentFromSVG(`
    <circle cx="0" cy="0" r="1"/>
    <circle cx="1" cy="1" r="2"/>
    <circle cx="2" cy="2" r="3"/>
    `);
    df.appendChild(document.createComment("A comment to be cleaned"));
    expect(df.childNodes.length).toBe(4);
    expect(df.children.length).toBe(3);

    cleanupChildNodes(df);
    expect(df.childNodes.length).toBe(3);
    expect(df.children.length).toBe(3);
  });

  test("SVG custom cleanup", () => {
    const df = fragmentFromSVG(`
    <circle cx="0" cy="0" r="1"/>
    <rect x="0" cy="0" width="100" height="30"/>
    <circle cx="2" cy="2" r="3"/>
    `);
    df.appendChild(document.createComment("A comment to be cleaned"));
    expect(df.childNodes.length).toBe(4);
    expect(df.children.length).toBe(3);

    cleanupChildNodes(
      df,
      (node: Node) => node instanceof Element && node.tagName != "rect"
    );
    expect(df.childNodes.length).toBe(2);
    expect(df.children.length).toBe(2);
  });
});

//======
describe("removeAllChildren", () => {
  test("On no child parent", () => {
    const parent = document.createElement("div");
    expect(parent.childNodes.length).toEqual(0);
    expect(parent.children.length).toEqual(0);
    removeAllChildren(parent);
    expect(parent.childNodes.length).toEqual(0);
    expect(parent.children.length).toEqual(0);
  });

  test("On html div", () => {
    const parent = $E(`
    <p>bla bla bla</p>
    <p>ble ble ble</p>
    <p>bli bli bli</p>
    <p>blo blo blo</p>
    <p>blu blu blu</p>
    `);

    expect(parent.tagName).toEqual("DIV");
    expect(parent.childNodes.length).toEqual(5);
    expect(parent.children.length).toEqual(5);

    removeAllChildren(parent);
    expect(parent.tagName).toEqual("DIV");
    expect(parent.childNodes.length).toEqual(0);
    expect(parent.children.length).toEqual(0);
  });

  test("On svg elt", () => {
    const parent = document.createElementNS(namespaceURI.svg, "svg");
    const children = fragmentFromSVG(`
    <circle cx="10", cy="10" r="5"/>
    <rect x="20", y="21" width="65" height="130"/>`);
    parent.appendChild(children);

    expect(parent.tagName).toEqual("svg");
    expect(parent.namespaceURI).toEqual(namespaceURI.svg);
    expect(parent.childNodes.length).toEqual(2);
    expect(parent.children.length).toEqual(2);

    removeAllChildren(parent);

    expect(parent.tagName).toEqual("svg");
    expect(parent.namespaceURI).toEqual(namespaceURI.svg);
    expect(parent.childNodes.length).toEqual(0);
    expect(parent.children.length).toEqual(0);
  });
});

//======
describe("fragmentFromHtml", () => {
  test("Basic usage", () => {
    const html = `
    <div>
    <ul>
    <li>One</li>
    </ul>
    </div>

    <main></main>

    <section></section>
    `;

    let df = fragmentFromHTML(html);
    expect(df.childNodes.length).toBeGreaterThan(5);
    expect(df.children.length).toBe(3);

    df = fragmentFromHTML(html, true);
    expect(df.childNodes.length).toBe(3);
    expect(df.children.length).toBe(3);
  });

  test("from empty string", () => {
    const df = fragmentFromHTML("");
    expect(df.children.length).toBe(0);
    expect(df.childNodes.length).toBe(0);
  });

  test("cleanup modes", () => {
    const html = `
      Hello world
      <div>Alpha</div>
      <div>Beta</div>
    `;
    // default: no cleanup
    let fragment = fragmentFromHTML(html);
    expect(fragment.childNodes.length).toBeGreaterThan(3);
    expect(fragment.children.length).toEqual(2);
    let text = "";
    fragment.childNodes.forEach((node) => {
      text += node instanceof Text ? node.textContent : "";
    });
    expect(text.trim()).toEqual("Hello world");

    // default cleanup
    fragment = fragmentFromHTML(html, true);
    expect(fragment.childNodes.length).toEqual(3); // no blank text
    expect(fragment.children.length).toEqual(2);
    expect(fragment.childNodes[0]).toBeInstanceOf(Text);
    expect(fragment.childNodes[0].textContent!.trim()).toEqual("Hello world");
    expect((fragment.childNodes[1] as Element).tagName).toEqual("DIV");
    expect((fragment.childNodes[1] as Element).textContent).toEqual("Alpha");
    expect((fragment.childNodes[2] as Element).tagName).toEqual("DIV");
    expect((fragment.childNodes[2] as Element).textContent).toEqual("Beta");

    // Elements only
    fragment = fragmentFromHTML(html, NodeFilters.element);
    expect(fragment.childNodes.length).toEqual(2);
    expect(fragment.children.length).toEqual(2);
    expect((fragment.childNodes[0] as Element).tagName).toEqual("DIV");
    expect((fragment.childNodes[0] as Element).textContent).toEqual("Alpha");
    expect((fragment.childNodes[1] as Element).tagName).toEqual("DIV");
    expect((fragment.childNodes[1] as Element).textContent).toEqual("Beta");
  });
});

//======
describe("fragmentSVG", () => {
  test("Basic usage", () => {
    const svg = `
    <circle cx="10", cy="10" r="5"/>


    <rect x="20", y="21" width="65" height="130"/>
    
    
    `;

    let df = fragmentFromSVG(svg);
    expect(df.childNodes.length).toBe(2);
    expect(df.children.length).toBe(2);
    expect(df.children[0].tagName).toBe("circle");
    expect(df.children[0].namespaceURI).toBe(namespaceURI.svg);
    expect(df.children[1].tagName).toBe("rect");
    expect(df.children[1].namespaceURI).toBe(namespaceURI.svg);
  });

  test("from empty string", () => {
    const df = fragmentFromSVG("");
    expect(df.children.length).toBe(0);
    expect(df.childNodes.length).toBe(0);
  });

  test("With cleanup", () => {
    const svg = `
    <rect x="10", y="11" width="10" height="13"/>
    <circle cx="10", cy="10" r="5"/>
    <rect x="20", y="21" width="65" height="130"/>
    `;

    let df = fragmentFromSVG(svg, false);
    expect(df.children.length).toBe(3);
    expect(df.childNodes.length).toBe(3);

    df = fragmentFromSVG(svg, true);
    expect(df.children.length).toBe(3);
    expect(df.childNodes.length).toBe(3);

    df = fragmentFromSVG(
      svg,
      (node) => node instanceof Element && node.tagName != "circle"
    );
    expect(df.children.length).toBe(2);
    expect(df.childNodes.length).toBe(2);
  });
});

//======
describe("wrapDocumentFragment", () => {
  test("Basic usage", () => {
    const df = fragmentFromHTML(`
    <p>A</p>
    <p>B</p>
    <p>C</p>
    `);
    const elt = wrapDocumentFragment(df);
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBe(3);
  });

  test("cleanup: false", () => {
    const df = fragmentFromHTML(`
  <p>A</p>
  <p>B</p>
  <p>C</p>
  `);

    const elt = wrapDocumentFragment(df, {
      cleanup: false,
    });
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBeGreaterThan(5);
  });

  test("custom wrapTag", () => {
    const df = fragmentFromHTML(`
  <p>A</p>
  <p>B</p>
  <p>C</p>
  `);

    const elt = wrapDocumentFragment(df, {
      wrapTag: "section",
    });
    expect(elt.tagName).toBe("SECTION");
    expect(elt.childNodes.length).toBe(3);
    expect(elt.children.length).toBe(3);
  });

  test("wrapSingle", () => {
    const html = `
      <ul>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>
    `;

    let elt = wrapDocumentFragment(html);
    expect(elt.tagName).toBe("UL");

    elt = wrapDocumentFragment(html, { wrapSingle: true, cleanup: true });
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBe(1);
    expect((<HTMLElement>elt.childNodes[0]).tagName).toBe("UL");
  });

  test("Wrap empty", () => {
    let elt = wrapDocumentFragment(new DocumentFragment());
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBe(0);
    expect(elt.children.length).toBe(0);

    elt = wrapDocumentFragment("");
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBe(0);
    expect(elt.children.length).toBe(0);
  });

  const ulHTML = `<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
  <li>D</li>
  <li>E</li>
</ul>`;

  test("Wrap from text", () => {
    let elt = wrapDocumentFragment(ulHTML);
    for (let i = 0; i < elt.childNodes.length; i += 1) {}
    // cleanupChildNodes(elt)
    expect(elt.tagName).toBe("UL");
    expect(elt.children.length).toBe(5);
    expect(elt.childNodes.length).toBe(5);
  });

  test("cleanup: false", () => {
    const df = fragmentFromHTML(`
  <p>A</p>
  <p>B</p>
  <p>C</p>
  `);

    const elt = wrapDocumentFragment(df, {
      cleanup: false,
    });
    expect(elt.tagName).toBe("DIV");
    expect(elt.childNodes.length).toBeGreaterThan(5);
  });

  test("custom cleanup", () => {
    const html = `
    <p>A</p>
    <img src="https://img.net/a.png">
    <p>B</p>
    <img src="https://img.net/b.png">
    <p>C</p>
    `;
    let div = wrapDocumentFragment(html);

    expect(div.tagName).toEqual("DIV");
    expect(div.childNodes.length).toBe(5);
    expect(div.children.length).toBe(5);

    div = wrapDocumentFragment(html, { cleanup: false });
    expect(div.tagName).toEqual("DIV");
    expect(div.childNodes.length).toBeGreaterThan(5);
    expect(div.children.length).toBe(5);

    div = wrapDocumentFragment(html, {
      cleanup: (node) => node instanceof Element && node.tagName != "IMG",
    });
    expect(div.tagName).toEqual("DIV");
    expect(div.childNodes.length).toBe(3);
    expect(div.children.length).toBe(3);
  });
});

//====
describe("wrapSVGFragment", () => {
  test("Basic usage", () => {
    const df = fragmentFromSVG(`
    <circle cx="0" cy="0" r="1"/>
    <circle cx="1" cy="1" r="2"/>
    <circle cx="2" cy="2" r="3"/>
    `);

    const elt = wrapSVGFragment(df);
    expect(elt.tagName).toBe("g");
    expect(elt.namespaceURI).toBe(namespaceURI.svg);
    expect(elt.childNodes.length).toBe(3);
    for (let i = 0; i < 3; i += 1) {
      const child = elt.childNodes[i];
      expect(child).toBeInstanceOf(SVGElement);
      const svgChild = child as SVGElement;
      expect(svgChild.tagName).toBe("circle");
      expect(svgChild.getAttribute("cx")).toEqual(i.toString());
    }
  });
});
