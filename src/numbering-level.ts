import { Style } from "./style.js";
import { WordStyles } from "./word-styles.js";
import { Xml } from "./xml.js";

export enum NumberingFormat {
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

export enum NumberingSuffix {
    nothing = "nothing",
    space = "space",
    tab = "tab"
} 

export class NumberingLevel {
    public index: number;
    public style: Style = new Style();
    public format: NumberingFormat = NumberingFormat.none;
    public start: number | undefined = undefined;
    public suffix: NumberingSuffix = NumberingSuffix.tab;
    public text: string | undefined = undefined;

    public static fromLevelNode(styles: WordStyles | undefined, levelNode: ChildNode): NumberingLevel | undefined {
        const indexAttr = (levelNode as Element).getAttribute("w:ilvl");
        if (indexAttr === null) {
            return undefined;
        }
        const index = parseInt(indexAttr, 10);
        const level = new NumberingLevel(index);
        level.style = Style.fromStyleNode(styles, levelNode);
        level.start = Xml.getNumberValueFromNode(levelNode, "w:start");
        const suffix = Xml.getStringValueFromNode(levelNode, "w:suff");
        if (suffix !== undefined) {
            level.suffix = NumberingSuffix[suffix as keyof typeof NumberingSuffix];
        }
        const format = Xml.getStringValueFromNode(levelNode, "w:numFormat");
        if (format !== undefined) {
            level.format = NumberingFormat[format as keyof typeof NumberingFormat];
        }
        level.text = Xml.getStringValueFromNode(levelNode, "w:lvlText");
        return level;
    }

    constructor(index: number) {
        this.index = index;
    }
}