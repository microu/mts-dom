import { classNames } from "./classNames.js";
import { fragmentFromHTML, namespaceURI, wrapDocumentFragment } from "./utils.js";

export type TCreateElement0Arg = {
  html?: string;
  tag?: string;
  namespace?: string;
  attributes?: { [keys: string]: string };
  children?: null| string | TCreateElement0ArgExtended[];
  text?: string;
  classes?: string | string[];
};

export type TCreateElement0ArgExtended = string | Element | TCreateElement0Arg;

const namespaceShortcuts: { [keys: string]: string } = {
  "!svg": namespaceURI.svg,
  "!xhtml": namespaceURI.xhtml,
  "!html": namespaceURI.xhtml,
};

export function createElement0(
  arg: TCreateElement0ArgExtended,
  attributes?: { [keys: string]: string } | null,
  children?: string | TCreateElement0ArgExtended[]
): Element {
  let element: Element | undefined = undefined;
  let _arg: TCreateElement0Arg;

  if (typeof arg == "string") {
    arg = arg.trim();
    if (arg.length == 0) {
      arg = ":div";
    }
    if (arg.startsWith("<")) {
      _arg = { html: arg };
    } else if (arg.startsWith(":")) {
      let tag = arg.slice(1);
      let text = "";
      const pos = tag.indexOf(":");
      if (pos >= 0) {
        text = tag.slice(pos + 1);
        tag = tag.slice(0, pos);
      }
      _arg = { tag, text: text.length > 0 ? text : undefined };
    } else {
      _arg = { tag: "p", text: arg };
    }
  } else if (arg instanceof Element) {
    element = arg;
    _arg = {};
  } else {
    _arg = arg;
  }

  if (attributes != undefined && attributes != null) {
    _arg.attributes = attributes;
  }

  if (children != undefined && children != null) {
    _arg.children = children;
  }

  if (_arg.attributes == undefined) {
    _arg.attributes = {};
  }

  if (_arg.children == undefined) {
    _arg.children = [];
  }

  if (_arg.namespace != undefined && _arg.namespace.startsWith("!")) {
    if (_arg.namespace in namespaceShortcuts) {
      _arg.namespace = namespaceShortcuts[_arg.namespace];
    }
  }

  if (element == undefined && _arg.html == undefined && _arg.tag == undefined) {
    throw new Error(`ut`);
  }

  if (_arg.html != undefined && _arg.namespace != undefined) {
    throw new Error(
      `One can't use arg.namespace on an element defined by arg.html. If needed the namespace has to be defiined in the HTML source.`
    );
  }
  if (element == undefined) {
    if (_arg.html != undefined) {
      element = wrapDocumentFragment(_arg.html, { wrapTag: _arg.tag });
    } else {
      if (_arg.namespace !== undefined) {
        element = document.createElementNS(_arg.namespace, _arg.tag!);
      } else {
        element = document.createElement(_arg.tag!);
      }
    }
  }
  for (const [name, value] of Object.entries(_arg.attributes)) {
    element.setAttribute(name, value);
  }

  if (_arg.text !== undefined) {
    const textNode = document.createTextNode(_arg.text);
    element.appendChild(textNode);
  }

  if (typeof _arg.children == "string") {
    const fragment = fragmentFromHTML(_arg.children, true);
    if (fragment != undefined) {
      element.appendChild(fragment);
    }
  } else {
    for (const child of _arg.children) {
      element.appendChild(createElement0(child));
    }
  }
  if (_arg.classes != undefined) {
    const classes = classNames(_arg.classes, true);
    for (const className of classes) {
      if (!element.classList.contains(className)) {
        element.classList.add(className);
      }
    }
  }

  return element;
}

export const $E0 = createElement0;
