import {
  cleanupChildNodes,
  fragmentFromHTML,
  fragmentFromSVG,
  namespaceURI,
  NodeFilters,
  wrapDocumentFragment,
  wrapSVGFragment,
} from "../src/index.js";

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
});

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
});

describe("cleanupDocumentFragment", () => {
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
});

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

  test("eltOnly: false", () => {
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
});

describe("wrapSVGFragment", () => {
  test("Basic usage", () => {
    const df = fragmentFromSVG(`
    <circle cx="0" cy="0" r="1"/>
    <circle cx="1" cy="1" r="2"/>
    <circle cx="2" cy="2" r="3"/>
    `);

    const elt = wrapSVGFragment(df);
    expect(elt.tagName).toBe("g");
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
