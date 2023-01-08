import {
  namespaceURI,
  wrapDocumentFragment,
  wrapSVGFragment,
} from "./utils.js";

export type TCreateElementArg = {
  html?: string;
  svg?: string;
  tag?: string;
  attributes?: { [keys: string]: string };
  children?: TCreateElementArgExtended[];
  classes?: string | string[];
};

export type TCreateElementArgExtended = string | Element | TCreateElementArg;

export function createElement(
  arg: TCreateElementArgExtended,
  attributes?: { [keys: string]: string } | null,
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
    if (arg.startsWith("<svg!")) {
      _arg = { svg: "<" + arg.slice(5) };
    } else if (arg.startsWith("<svg")) {
      _arg = { svg: arg };
    } else if (arg.startsWith("<")) {
      _arg = { html: arg };
    } else {
      _arg = { html: `<p>${arg}</p>` };
    }
    element = createElementBase(_arg);
  } else if (arg instanceof Element) {
    element = arg;
  } else {
    element = createElementBase(arg);
  }

  return element;
}

export function createElementBase(arg: TCreateElementArg): Element {
  let element: Element | undefined = undefined;

  if (arg.html != undefined) {
    element = wrapDocumentFragment(arg.html);
  }

  if (arg.tag != undefined) {
    if (element != undefined) {
      throw new ErrorEvent(`Element already defined using "html"`);
    }
    if (arg.tag.startsWith("svg!")) {
      element = document.createElementNS(namespaceURI.svg, arg.tag.slice(4));
    } else {
      element = document.createElement(arg.tag);
    }
  }

  if (arg.svg != undefined) {
    if (element != undefined) {
      throw new ErrorEvent(`Element already defined using "html" or "tag"`);
    }
    element = wrapSVGFragment(arg.svg);
  }

  if (element == undefined) {
    throw new Error("Either arg.html or arg.tag or arg.svg must be defined");
  }

  return element;
}

export const $E = createElement;
