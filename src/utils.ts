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
  cleanup = cleanup === true ? NodeFilters.elementOrNonBlankText : cleanup;
  if (cleanup) {
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
  return _wrapFragment(df, false, options);
}

export function wrapSVGFragment(
  df: DocumentFragment | string,
  options?: {
    wrapTag?: string;
    wrapSingle?: boolean;
    cleanup?: boolean | TNodeFilter;
  }
): Element {
  return _wrapFragment(df, true, options);
}

function _wrapFragment(
  df: DocumentFragment | string,
  svgMode: boolean,
  options?: {
    wrapTag?: string;
    wrapSingle?: boolean;
    cleanup?: boolean | TNodeFilter;
  }
): Element {
  let fragment: DocumentFragment;
  if (svgMode) {
    fragment = typeof df == "string" ? fragmentFromSVG(df) : df;
  } else {
    fragment = typeof df == "string" ? fragmentFromHTML(df) : df;
  }

  const _options = {
    wrapTag: svgMode ? "g" : "div",
    wrapSingle: false,
    cleanup: true,
  };
  Object.assign(_options, options);

  let result = <Element>fragment.firstElementChild;

  if (_options.wrapSingle || fragment.children.length != 1) {
    const wrapper = svgMode
      ? document.createElementNS(namespaceURI.svg, _options.wrapTag)
      : document.createElement(_options.wrapTag);
    wrapper.append(fragment);
    result = wrapper;
  }

  const cleanup =
    _options.cleanup === true
      ? NodeFilters.elementOrNonBlankText
      : _options.cleanup;
  if (cleanup) {
    cleanupChildNodes(result, cleanup);
  }

  return result;
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
