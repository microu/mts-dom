declare const namespaceURI: {
    xhtml: string;
    svg: string;
};
declare function fragmentFromHTML(html: string, cleanup?: boolean): DocumentFragment;
declare function wrapDocumentFragment(df: DocumentFragment | string, options?: {
    wrapTag?: string;
    eltOnly?: boolean;
    wrapSingle?: boolean;
}): Element;
declare function cleanupChildNodes(parent: Node, nodeFilter?: (n: Node) => boolean): void;
declare namespace cleanupChildNodes {
    var HTMLOrNonBlankText: (n: Node) => boolean;
    var HTML: (n: Node) => boolean;
}
declare function removeAllChildren(parent: Node): void;

type TClassNamesArg = null | undefined | string | string[];
declare function isClassNamesArg(arg: any): arg is TClassNamesArg;
declare function classNames(arg: TClassNamesArg): string;
declare function classNames(arg: TClassNamesArg, asArray: false): string;
declare function classNames(arg: TClassNamesArg, asArray: true): string[];
declare const $C: typeof classNames;
declare function toogleClasses(elt: Element, remove?: TClassNamesArg, add?: TClassNamesArg): Element;

type TCreateElementArg = {
    html?: string;
    tag?: string;
    namespace?: string;
    attributes?: {
        [keys: string]: string;
    };
    children?: null | string | TCreateElementArgExtended[];
    text?: string;
    classes?: string | string[];
};
type TCreateElementArgExtended = string | Element | TCreateElementArg;
declare function createElement(arg: TCreateElementArgExtended, attributes?: {
    [keys: string]: string;
} | null, children?: string | TCreateElementArgExtended[]): Element;
declare const $E: typeof createElement;

export { $C, $E, TClassNamesArg, TCreateElementArg, TCreateElementArgExtended, classNames, cleanupChildNodes, createElement, fragmentFromHTML, isClassNamesArg, namespaceURI, removeAllChildren, toogleClasses, wrapDocumentFragment };
