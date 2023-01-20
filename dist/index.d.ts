declare const namespaceURI: {
    xhtml: string;
    svg: string;
};
type TNodeFilter = (node: Node) => boolean;
declare const NodeFilters: {
    [name: string]: TNodeFilter;
};
declare function cleanupChildNodes(parent: Node, nodeFilter?: TNodeFilter): void;
declare function removeAllChildren(parent: Node): void;
declare function fragmentFromHTML(html: string, cleanup?: boolean | TNodeFilter): DocumentFragment;
declare function fragmentFromSVG(svg: string, cleanup?: boolean | TNodeFilter): DocumentFragment;
declare function wrapDocumentFragment(df: DocumentFragment | string, options?: {
    wrapTag?: string;
    wrapSingle?: boolean;
    cleanup?: boolean | TNodeFilter;
}): Element;
declare function wrapSVGFragment(df: DocumentFragment | string, options?: {
    wrapTag?: string;
    wrapSingle?: boolean;
    cleanup?: boolean | TNodeFilter;
}): Element;

type TClassNamesArg = null | undefined | string | string[];
declare function isClassNamesArg(arg: any): arg is TClassNamesArg;
declare function classNames(arg: TClassNamesArg): string;
declare function classNames(arg: TClassNamesArg, asArray: false): string;
declare function classNames(arg: TClassNamesArg, asArray: true): string[];
declare const $C: typeof classNames;
declare function toogleClasses(elt: Element, remove?: TClassNamesArg, add?: TClassNamesArg): Element;

type TCreateElementArg = {
    html?: string;
    svg?: string;
    element?: Element;
    children?: TCreateElementArgExtended[];
};
type TCreateElementArgExtended = string | Element | TCreateElementArg;
declare function createElement(arg: TCreateElementArgExtended, children?: TCreateElementArgExtended[]): Element;
declare function createElementBase(arg: TCreateElementArg): Element;
declare const $E: typeof createElement;

type TCreateElement0Arg = {
    html?: string;
    tag?: string;
    namespace?: string;
    attributes?: {
        [keys: string]: string;
    };
    children?: null | string | TCreateElement0ArgExtended[];
    text?: string;
    classes?: string | string[];
};
type TCreateElement0ArgExtended = string | Element | TCreateElement0Arg;
declare function createElement0(arg: TCreateElement0ArgExtended, attributes?: {
    [keys: string]: string;
} | null, children?: string | TCreateElement0ArgExtended[]): Element;
declare const $E0: typeof createElement0;

export { $C, $E, $E0, NodeFilters, TClassNamesArg, TCreateElement0Arg, TCreateElement0ArgExtended, TCreateElementArg, TCreateElementArgExtended, TNodeFilter, classNames, cleanupChildNodes, createElement, createElement0, createElementBase, fragmentFromHTML, fragmentFromSVG, isClassNamesArg, namespaceURI, removeAllChildren, toogleClasses, wrapDocumentFragment, wrapSVGFragment };
