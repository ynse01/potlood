import { Style } from "../text/style.js";
import { NamedStyles } from "../text/named-styles.js";
export declare enum NumberingFormat {
    none = "none",
    bullet = "bullet",
    cardinalText = "cardinalText",
    chicago = "chicago",
    decimal = "decimal",
    decimalEnclosedCircle = "decimalEnclosedCircle",
    decimalEnclodedFullStop = "decimalEnclosedFullstop",
    decimalEnclosedParentheses = "decimalEnclosedParen",
    decimalZero = "decimalZero",
    lowerLetter = "lowerLetter",
    lowerRoman = "lowerRoman",
    ordinalText = "ordinalText",
    upperLetter = "upperLetter",
    upperRoman = "upperRoman"
}
export declare enum NumberingSuffix {
    nothing = "nothing",
    space = "space",
    tab = "tab"
}
export declare class NumberingLevel {
    index: number;
    style: Style;
    format: NumberingFormat;
    start: number | undefined;
    suffix: NumberingSuffix;
    text: string | undefined;
    static fromLevelNode(namedStyles: NamedStyles | undefined, levelNode: ChildNode): NumberingLevel | undefined;
    constructor(index: number);
    getText(indices: number[]): string;
    private getFormatted;
}
