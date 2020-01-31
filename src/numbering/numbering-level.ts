import { Style } from "../text/style.js";
import { NamedStyles } from "../text/named-styles.js";
import { Xml } from "../utils/xml.js";

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

    public static fromLevelNode(namedStyles: NamedStyles | undefined, levelNode: ChildNode): NumberingLevel | undefined {
        const indexAttr = Xml.getAttribute(levelNode, "w:ilvl");
        if (indexAttr === undefined) {
            return undefined;
        }
        const index = parseInt(indexAttr, 10);
        const level = new NumberingLevel(index);
        level.style = Style.fromStyleNode(levelNode);
        level.style.applyNamedStyles(namedStyles);
        levelNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:start":
                    level.start = Xml.getNumberValue(child);
                    break;
                case "w:suff":
                    const suffix = Xml.getStringValue(child);
                    if (suffix !== undefined) {
                        level.suffix = NumberingSuffix[suffix as keyof typeof NumberingSuffix];
                    }                                
                    break;
                case "w:numFmt":
                    const format = Xml.getStringValue(child);
                    if (format !== undefined) {
                        level.format = NumberingFormat[format as keyof typeof NumberingFormat];
                    }
                    break;
                case "w:lvlText":
                    level.text = Xml.getStringValue(child);
                    break;
                case "w:lvlJc":
                case "w:pPr":
                case "w:rPr":
                case "w:pStyle":
                    // Ignore, part of Style.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Numbering Level reading.`);
                    break;
            }
        });
        return level;
    }

    constructor(index: number) {
        this.index = index;
    }

    public getText(indices: number[]): string {
        //if (this.text !== undefined) {
        //    // Work around for FireFox 71+, crashing on non ASCII characters.
        //   return (this.text === "") ? "" : "-";
        //}
        return this.getFormatted(indices);
    }

    private getFormatted(indices: number[]): string {
        let text: string;
        switch (this.format) {
            case NumberingFormat.bullet:
                text = "&#x2002;";
                // Work around for FireFox 71+, crashing on non ASCII characters.
                text = "-";
                break;
            case NumberingFormat.none:
                text = "";
                break;
            case NumberingFormat.decimal:
                text = indices.map(idx => idx.toString()).join(".");
                break;
            case NumberingFormat.lowerLetter:
                text = indices.map(this._toDecimal).join(".");
                break;
            case NumberingFormat.upperLetter:
                text = indices.map(this._toDecimal).join(".").toLocaleUpperCase();
                break;
            case NumberingFormat.lowerRoman:
                text = indices.map(this._toRoman).join(".");
                break;
            case NumberingFormat.upperRoman:
                text = indices.map(this._toRoman).join(".").toLocaleUpperCase();
                break;
            default:
                console.log(`Don't know how to render numbering format ${this.format}`);
                text = "-";
                break;
        }
        return text;
    }

    private _toDecimal(num: number): string {
        if (num > 26) {
            return this._toDecimal(num / 26) + this._toDecimal(num % 26);
        }
        return String.fromCharCode(97 + Math.floor(num));
    }

    private _romanCodes = [
        ["","I","II","III","IV","V","VI","VII","VIII","IX"],         // Ones
        ["","X","XX","XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],   // Tens
        ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"]];        // Hundreds

    private _toRoman(num: number): string {
        var numeral = "";
        var digits = num.toString().split('').reverse();
        for (let i = 0; i < digits.length; i++) {
            numeral = this._romanCodes[i][parseInt(digits[i])] + numeral;
        }
        return numeral;  
    }
}