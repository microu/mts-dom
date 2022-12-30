import {
  cleanupChildNodes,
  fragmentFromHTML,
  wrapDocumentFragment,
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


  test("kepp HTML Element", () => {
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

    cleanupChildNodes(df, cleanupChildNodes.HTML);
    expect(df.childNodes.length).toBe(3);
    expect(df.children.length).toBe(3);
    for (let i=0; i< df.children.length; i+=1) {
      let child = df.children[i]
      expect(child.tagName).toBe(child.textContent)
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
      eltOnly: false,
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

    elt = wrapDocumentFragment(html, { wrapSingle: true, eltOnly: true });
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
    let elt = wrapDocumentFragment(ulHTML)
    for(let i =0; i< elt.childNodes.length; i+=1) {
    }
    // cleanupChildNodes(elt)
    expect(elt.tagName).toBe("UL")
    expect(elt.children.length).toBe(5)
    expect(elt.childNodes.length).toBe(5)
  });
});
