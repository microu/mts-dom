const elementWithClassAttributeRE = /^<\w+.*\sclass="([^"]*)"/;

export type TClassNamesArg = null | undefined | string | string[];

export function isClassNamesArg(arg: any): arg is TClassNamesArg {
  if (arg === undefined || arg === null || typeof arg === "string") {
    return true;
  } else if (arg instanceof Array) {
    return arg.length > 0 ? typeof arg[0] === "string" : true;
  }
  return false;
}

export function classNames(arg: TClassNamesArg): string;
export function classNames(arg: TClassNamesArg, asArray: false): string;
export function classNames(arg: TClassNamesArg, asArray: true): string[];
export function classNames(arg: TClassNamesArg, asArray?: boolean): string[] | string {
  let classes: string[];

  if (typeof arg == "string") {
    const m = elementWithClassAttributeRE.exec(arg);
    if (m) {
      classes = m[1]
        .trim()
        .split(/\s+/)
        .filter((c) => c != "");
    } else {
      if (arg.startsWith("<")) {
        classes = [];
      } else {
        classes = arg.split(/\s+/).filter((c) => c != "");
      }
    }
  } else if (arg == undefined || arg == null) {
    classes = [];
  } else {
    classes = arg;
  }

  classes = classes.map((name) => name.trim());

  if (asArray) {
    return classes;
  } else {
    return classes.join(" ");
  }
}
export const $C = classNames;

export function toogleClasses(elt: Element, remove?: string | string[], add?: string | string[]) {
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
