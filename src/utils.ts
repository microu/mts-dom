export const namespaceURI = {
  xhtml: "http://www.w3.org/1999/xhtml",
  svg: "http://www.w3.org/2000/svg",
};

export function fragmentFromHTML(html: string, cleanup?: boolean) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const df = <DocumentFragment>tpl.content.cloneNode(true);
  if (cleanup) {
    cleanupChildNodes(df);
  }
  return df;
}

export function wrapDocumentFragment(
  df: DocumentFragment | string,
  options?: { wrapTag?: string; eltOnly?: boolean; wrapSingle?: boolean }
): Element {
  const fragment = typeof df == "string" ? fragmentFromHTML(df) : df;
  const _options = {
    wrapTag: "div",
    eltOnly: true,
    wrapSingle: false,
  };
  Object.assign(_options, options);
  const { wrapTag, eltOnly, wrapSingle } = _options;

  if (eltOnly) {
    cleanupChildNodes(fragment);
    if (fragment.childNodes.length == 1) {
      cleanupChildNodes(fragment.firstElementChild!);
    }
  }

  if (wrapSingle || fragment.children.length != 1) {
    const wrapper = document.createElement(wrapTag);
    wrapper.append(fragment);
    return wrapper;
  } else {
    return <Element>fragment.firstElementChild;
  }
}

export function cleanupChildNodes(
  parent: Node,
  nodeFilter?: (n: Node) => boolean
) {
  if (!nodeFilter) {
    nodeFilter = cleanupChildNodes.HTMLOrNonBlankText;
  }

  const nodesToDelete: ChildNode[] = [];

  for (let i = 0; i < parent.childNodes.length; i++) {
    let child = parent.childNodes[i];
    if (!nodeFilter(child)) {
      nodesToDelete.push(child);
    }
  }

  for (const child of nodesToDelete) {
    parent.removeChild(child);
  }
}

cleanupChildNodes.HTMLOrNonBlankText = (n: Node) => {
  return (
    n instanceof Element || (n instanceof Text && n.textContent?.trim() != "")
  );
};

cleanupChildNodes.HTML = (n: Node) => {
  return n instanceof Element;
};

export function removeAllChildren(parent: Node) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
