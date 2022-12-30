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

const namespaceURI = {
    xhtml: "http://www.w3.org/1999/xhtml",
    svg: "http://www.w3.org/2000/svg",
};
function fragmentFromHTML(html, cleanup) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    const df = tpl.content.cloneNode(true);
    if (cleanup) {
        cleanupChildNodes(df);
    }
    return df;
}
function wrapDocumentFragment(df, options) {
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
            cleanupChildNodes(fragment.firstElementChild);
        }
    }
    if (wrapSingle || fragment.children.length != 1) {
        const wrapper = document.createElement(wrapTag);
        wrapper.append(fragment);
        return wrapper;
    }
    else {
        return fragment.firstElementChild;
    }
}
function cleanupChildNodes(parent, nodeFilter) {
    if (!nodeFilter) {
        nodeFilter = cleanupChildNodes.HTMLOrNonBlankText;
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
cleanupChildNodes.HTMLOrNonBlankText = (n) => {
    var _a;
    return (n instanceof Element || (n instanceof Text && ((_a = n.textContent) === null || _a === void 0 ? void 0 : _a.trim()) != ""));
};
cleanupChildNodes.HTML = (n) => {
    return n instanceof Element;
};

const namespaceShortcuts = {
    "!svg": namespaceURI.svg,
    "!xhtml": namespaceURI.xhtml,
    "!html": namespaceURI.xhtml,
};
function createElement(arg, attributes, children) {
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
        throw new Error(`Either arg.html or arg.tag must be defined`);
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
            element.appendChild(createElement(child));
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
const $E = createElement;

export { $C, $E, classNames, createElement, isClassNamesArg, toogleClasses };
