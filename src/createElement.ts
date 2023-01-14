import {
  namespaceURI,
  wrapDocumentFragment,
  wrapSVGFragment,
} from "./utils.js";

export type TCreateElementArg = {
  html?: string;
  svg?: string;
  element?: Element;
  children?: TCreateElementArgExtended[];
};

export type TCreateElementArgExtended = string | Element | TCreateElementArg;

export function createElement(
  arg: TCreateElementArgExtended,
  children?: TCreateElementArgExtended[]
): Element {
  let element: Element | undefined = undefined;
  let _arg: TCreateElementArg;

  if (typeof arg == "string") {
    // normalize string arg
    arg = arg.trim();
    if (arg.length == 0) {
      arg = "<div></div>";
    }
    // handle string cases
    if (arg.startsWith("!svg!")) {
      _arg = { svg: arg.slice(5) };
    } else if (arg.startsWith("<svg")) {
      _arg = { svg: arg };
    } else if (arg.startsWith("<")) {
      _arg = { html: arg };
    } else {
      _arg = { html: `<p>${arg}</p>` };
    }
  } else if (arg instanceof Element) {
    _arg = { element: arg };
  } else {
    _arg = arg;
  }

  if (children) {
    _arg.children = [
      ...(_arg.children == undefined ? [] : _arg.children),
      ...children,
    ];
  }
  element = createElementBase(_arg);

  return element;
}

export function createElementBase(arg: TCreateElementArg): Element {
  let element: Element | undefined = undefined;

  if (arg.element != undefined) {
    element = arg.element;
  }

  if (arg.html != undefined) {
    if (element != undefined) {
      throw new ErrorEvent(`Element already defined using "arg.element"`);
    }
    element = wrapDocumentFragment(arg.html);
  }

  if (arg.svg != undefined) {
    if (element != undefined) {
      throw new ErrorEvent(
        `Element already defined using arg.html or arg.element `
      );
    }
    element = wrapSVGFragment(arg.svg);
  }

  if (element == undefined) {
    throw new Error("Either arg.html, arg.svg or arg.element must be defined");
  }

  // Handle children
  if (arg.children != undefined) {
    if (arg.svg != undefined) {
      arg.children = arg.children.map((child: TCreateElementArgExtended) => {
        if (typeof child == "string") {
          return { svg: child };
        } else {
          return child;
        }
      });
    }

    for (const childArg of arg.children) {
      const childElement = createElement(childArg)
      element.appendChild(childElement)
    }
  }
  return element;
}

export const $E = createElement;
