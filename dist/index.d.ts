type TClassNamesArg = null | undefined | string | string[];
declare function isClassNamesArg(arg: any): arg is TClassNamesArg;
declare function classNames(arg: TClassNamesArg): string;
declare function classNames(arg: TClassNamesArg, asArray: false): string;
declare function classNames(arg: TClassNamesArg, asArray: true): string[];
declare const $C: typeof classNames;
declare function toogleClasses(elt: Element, remove?: string | string[], add?: string | string[]): Element;

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

export { $C, $E, TClassNamesArg, TCreateElementArg, TCreateElementArgExtended, classNames, createElement, isClassNamesArg, toogleClasses };
