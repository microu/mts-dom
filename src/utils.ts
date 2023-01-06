export const namespaceURI = {
  xhtml: "http://www.w3.org/1999/xhtml",
  svg: "http://www.w3.org/2000/svg",
};

export type TNodeFilter = (node: Node) => boolean;

export const NodeFilters: { [name: string]: TNodeFilter } = {
  elementOrNonBlankText: (n: Node) => {
    return (
      n instanceof Element || (n instanceof Text && n.textContent?.trim() != "")
    );
  },

  element: (n: Node) => {
    return n instanceof Element;
  },
};

export function fragmentFromHTML(
  html: string,
  cleanup?: boolean | TNodeFilter
) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const df = <DocumentFragment>tpl.content.cloneNode(true);
  if (cleanup === true) {
    cleanupChildNodes(df, NodeFilters.elementOrNonBlankText);
  } else if (cleanup) {
    cleanupChildNodes(df, cleanup);
  }
  return df;
}

export function fragmentFromSVG(svg: string) {
  const g = document.createElementNS(namespaceURI.svg, "g");
  g.innerHTML = svg;
  const df = document.createDocumentFragment();
  df.append(...g.children);
  return df;
}

export function wrapDocumentFragment(
  df: DocumentFragment | string,
  options?: {
    wrapTag?: string;
    wrapSingle?: boolean;
    cleanup?: boolean | TNodeFilter;
  }
): Element {
  const fragment = typeof df == "string" ? fragmentFromHTML(df) : df;
  const _options = {
    wrapTag: "div",
    wrapSingle: false,
    cleanup: true,
  };
  Object.assign(_options, options);
  
  const cleanup = _options.cleanup === true ? NodeFilters.elementOrNonBlankText : undefined

  if (cleanup) {
    cleanupChildNodes(fragment, cleanup);
    if (fragment.childNodes.length == 1) {
      cleanupChildNodes(fragment.firstElementChild!, cleanup);
    }
  }

  if (_options.wrapSingle || fragment.children.length != 1) {
    const wrapper = document.createElement(_options.wrapTag);
    wrapper.append(fragment);
    return wrapper;
  } else {
    return <Element>fragment.firstElementChild;
  }
}

export function wrapSVGFragment(df: DocumentFragment | string): Element {
  const fragment = typeof df == "string" ? fragmentFromSVG(df) : df;

  for (const child of fragment.children) {
    console.log("FRAGMENT CHILD:", child.tagName, child.namespaceURI);
  }
  if (fragment.children.length != 1) {
    const wrapper = document.createElementNS(namespaceURI.svg, "g");
    wrapper.append(fragment);
    return wrapper;
  } else {
    return <Element>fragment.firstElementChild;
  }
}

export function cleanupChildNodes(parent: Node, nodeFilter?: TNodeFilter) {
  if (nodeFilter === undefined) {
    nodeFilter = NodeFilters.elementOrNonBlankText;
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

export function removeAllChildren(parent: Node) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
