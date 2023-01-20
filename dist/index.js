const namespaceURI = {
    xhtml: "http://www.w3.org/1999/xhtml",
    svg: "http://www.w3.org/2000/svg",
};
const NodeFilters = {
    elementOrNonBlankText: (n) => {
        var _a;
        return (n instanceof Element || (n instanceof Text && ((_a = n.textContent) === null || _a === void 0 ? void 0 : _a.trim()) != ""));
    },
    element: (n) => {
        return n instanceof Element;
    },
};
function cleanupChildNodes(parent, nodeFilter) {
    if (nodeFilter === undefined) {
        nodeFilter = NodeFilters.elementOrNonBlankText;
    }
    const nodesToDelete = [];
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
function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function fragmentFromHTML(html, cleanup) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    const df = tpl.content.cloneNode(true);
    cleanup = cleanup === true ? NodeFilters.elementOrNonBlankText : cleanup;
    if (cleanup) {
        cleanupChildNodes(df, cleanup);
    }
    return df;
}
function fragmentFromSVG(svg, cleanup) {
    const g = document.createElementNS(namespaceURI.svg, "g");
    g.innerHTML = svg;
    const df = document.createDocumentFragment();
    df.append(...g.children);
    cleanup = cleanup === true ? NodeFilters.elementOrNonBlankText : cleanup;
    if (cleanup) {
        cleanupChildNodes(df, cleanup);
    }
    return df;
}
function wrapDocumentFragment(df, options) {
    return _wrapFragment(df, false, options);
}
function wrapSVGFragment(df, options) {
    return _wrapFragment(df, true, options);
}
function _wrapFragment(df, svgMode, options) {
    let fragment;
    if (svgMode) {
        fragment = typeof df == "string" ? fragmentFromSVG(df) : df;
    }
    else {
        fragment = typeof df == "string" ? fragmentFromHTML(df) : df;
    }
    const _options = {
        wrapTag: svgMode ? "g" : "div",
        wrapSingle: false,
        cleanup: true,
    };
    Object.assign(_options, options);
    let result = fragment.firstElementChild;
    if (_options.wrapSingle || fragment.children.length != 1) {
        const wrapper = svgMode
            ? document.createElementNS(namespaceURI.svg, _options.wrapTag)
            : document.createElement(_options.wrapTag);
        wrapper.append(fragment);
        result = wrapper;
    }
    const cleanup = _options.cleanup === true
        ? NodeFilters.elementOrNonBlankText
        : _options.cleanup;
    if (cleanup) {
        cleanupChildNodes(result, cleanup);
    }
    return result;
}

const elementWithClassAttributeRE = /^<\w+.*\sclass="([^"]*)"/;
function isClassNamesArg(arg) {
    if (arg === undefined || arg === null || typeof arg === "string") {
        return true;
    }
    else if (arg instanceof Array) {
        return arg.length > 0 ? typeof arg[0] === "string" : true;
    }
    return false;
}
function classNames(arg, asArray) {
    let classes;
    if (typeof arg == "string") {
        const m = elementWithClassAttributeRE.exec(arg);
        if (m) {
            classes = m[1]
                .trim()
                .split(/\s+/)
                .filter((c) => c != "");
        }
        else {
            if (arg.startsWith("<")) {
                classes = [];
            }
            else {
                classes = arg.split(/\s+/).filter((c) => c != "");
            }
        }
    }
    else if (arg == undefined || arg == null) {
        classes = [];
    }
    else {
        classes = arg;
    }
    classes = classes.map((name) => name.trim());
    if (asArray) {
        return classes;
    }
    else {
        return classes.join(" ");
    }
}
const $C = classNames;
function toogleClasses(elt, remove, add) {
    const _remove = classNames(remove, true);
    const _add = classNames(add, true);
    for (const c of _remove) {
        elt.classList.remove(c);
    }
    for (const c of _add) {
        elt.classList.add(c);
    }
    return elt;
}

function createElement(arg, children) {
    let element = undefined;
    let _arg;
    if (typeof arg == "string") {
        // normalize string arg
        arg = arg.trim();
        if (arg.length == 0) {
            arg = "<div></div>";
        }
        // handle string cases
        if (arg.startsWith("!svg!")) {
            _arg = { svg: arg.slice(5) };
        }
        else if (arg.startsWith("<svg")) {
            _arg = { svg: arg };
        }
        else if (arg.startsWith("<")) {
            _arg = { html: arg };
        }
        else {
            _arg = { html: `<p>${arg}</p>` };
        }
    }
    else if (arg instanceof Element) {
        _arg = { element: arg };
    }
    else {
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
function createElementBase(arg) {
    let element = undefined;
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
            throw new ErrorEvent(`Element already defined using arg.html or arg.element `);
        }
        element = wrapSVGFragment(arg.svg);
    }
    if (element == undefined) {
        throw new Error("Either arg.html, arg.svg or arg.element must be defined");
    }
    // Handle children
    if (arg.children != undefined) {
        if (arg.svg != undefined) {
            arg.children = arg.children.map((child) => {
                if (typeof child == "string") {
                    return { svg: child };
                }
                else {
                    return child;
                }
            });
        }
        for (const childArg of arg.children) {
            const childElement = createElement(childArg);
            element.appendChild(childElement);
        }
    }
    return element;
}
const $E = createElement;

const namespaceShortcuts = {
    "!svg": namespaceURI.svg,
    "!xhtml": namespaceURI.xhtml,
    "!html": namespaceURI.xhtml,
};
function createElement0(arg, attributes, children) {
    let element = undefined;
    let _arg;
    if (typeof arg == "string") {
        arg = arg.trim();
        if (arg.length == 0) {
            arg = ":div";
        }
        if (arg.startsWith("<")) {
            _arg = { html: arg };
        }
        else if (arg.startsWith(":")) {
            let tag = arg.slice(1);
            let text = "";
            const pos = tag.indexOf(":");
            if (pos >= 0) {
                text = tag.slice(pos + 1);
                tag = tag.slice(0, pos);
            }
            _arg = { tag, text: text.length > 0 ? text : undefined };
        }
        else {
            _arg = { tag: "p", text: arg };
        }
    }
    else if (arg instanceof Element) {
        element = arg;
        _arg = {};
    }
    else {
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
        throw new Error(`One can't use arg.namespace on an element defined by arg.html. If needed the namespace has to be defiined in the HTML source.`);
    }
    if (element == undefined) {
        if (_arg.html != undefined) {
            element = wrapDocumentFragment(_arg.html, { wrapTag: _arg.tag });
        }
        else {
            if (_arg.namespace !== undefined) {
                element = document.createElementNS(_arg.namespace, _arg.tag);
            }
            else {
                element = document.createElement(_arg.tag);
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
    }
    else {
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
const $E0 = createElement0;

export { $C, $E, $E0, NodeFilters, classNames, cleanupChildNodes, createElement, createElement0, createElementBase, fragmentFromHTML, fragmentFromSVG, isClassNamesArg, namespaceURI, removeAllChildren, toogleClasses, wrapDocumentFragment, wrapSVGFragment };
