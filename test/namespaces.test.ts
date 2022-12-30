const xhtmlNSUri = "http://www.w3.org/1999/xhtml";
const svgNSuri = "http://www.w3.org/2000/svg";

describe("HMTL Element namespace", () => {
  test("document.createElement", () => {
    const pElt = document.createElement("p");
    expect(pElt instanceof HTMLElement).toBe(true);
    expect(pElt.tagName).toBe("P");
    expect(pElt.namespaceURI).toBe(xhtmlNSUri);
    expect(pElt.isDefaultNamespace(xhtmlNSUri)).toBe(true);
    expect(pElt.prefix).toBe(null);
    expect(pElt.localName).toBe("p");
  });

  test("document.createElementNS", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const SVG = document.createElementNS("http://www.w3.org/2000/svg", "SVG");
    expect(svg instanceof Element).toBe(true);
    expect(svg instanceof SVGElement).toBe(true);
    expect(svg instanceof SVGSVGElement).toBe(true);
    expect(svg.tagName).toBe("svg");
    expect(SVG.tagName).toBe("SVG");
    expect(svg.namespaceURI).toBe(svgNSuri);
    expect(svg.isDefaultNamespace(svgNSuri)).toBe(true);
    expect(svg.prefix).toBe(null);
    expect(svg.localName).toBe("svg");
    expect(SVG.localName).toBe("SVG");
  });

  test("document.appendChild", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    expect(svg.namespaceURI).toBe(svgNSuri);
    const rect = document.createElement("rect");
    expect(rect.namespaceURI).toBe(xhtmlNSUri);
    expect(rect instanceof HTMLElement).toBe(true);
    svg.appendChild(rect);
    expect(rect.namespaceURI).toBe(xhtmlNSUri);
  });

  test("svg.innerHtml", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    expect(svg.namespaceURI).toBe(svgNSuri);
    svg.innerHTML = `<rect width="100" height="100"/>`;
    const rect = svg.firstElementChild;
    expect(rect?.namespaceURI).toBe(svgNSuri);
    expect(rect instanceof SVGElement).toBe(true);
  });

  test("div.innerHtml no xmlns", () => {
    const div = document.createElement("div");
    expect(div.namespaceURI).toBe(xhtmlNSUri);
    div.innerHTML = `
        <svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /> 
</svg> 
`;

    const svg = div.firstElementChild;
    expect(svg!.namespaceURI).toBe(svgNSuri);
    expect(svg instanceof SVGElement).toBe(true);
    expect(svg!.tagName).toBe("svg");

    const circle = svg!.firstElementChild;
    expect(circle!.namespaceURI).toBe(svgNSuri);
    expect(circle instanceof SVGElement).toBe(true);
    expect(circle!.tagName).toBe("circle");
  });

  test("div.innerHtml with xmlns", () => {
    const div = document.createElement("div");
    expect(div.namespaceURI).toBe(xhtmlNSUri);
    div.innerHTML = `
        <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /> 
</svg> 
`;

    const svg = div.firstElementChild;
    expect(svg!.namespaceURI).toBe(svgNSuri);
    expect(svg instanceof SVGElement).toBe(true);
    expect(svg!.tagName).toBe("svg");

    const circle = svg!.firstElementChild;
    expect(circle!.namespaceURI).toBe(svgNSuri);
    expect(circle instanceof SVGElement).toBe(true);
    expect(circle!.tagName).toBe("circle");
  });
});
