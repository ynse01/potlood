import { Xml } from "./xml.js";
import { WordStyles } from "./word-styles.js";
import { Fonts } from "./fonts.js";

export class Style {
    private basedOn: Style | undefined;
    private _italic: boolean | undefined;
    private _bold: boolean | undefined;
    private _underlineMode: string | undefined;
    private _strike: boolean | undefined;
    private _dstrike: boolean | undefined;
    private _fontFamily: string | undefined;
    private _fontSize: number | undefined;
    private _spacing: number | undefined;
    private _color: string | undefined;
    private _caps: boolean | undefined;
    private _smallCaps: boolean | undefined;
    private _justification: string | undefined;

    public static fromStyleNode(styles: WordStyles | undefined, styleNode: ChildNode): Style {
        const runPrNode = Xml.getFirstChildOfName(styleNode, "w:rPr");
        return Style.fromPresentationNode(styles, runPrNode!);
    }

    public static fromParPresentationNode(styles: WordStyles | undefined, parPresentationNode: ChildNode): Style | undefined {
        let parStyle = new Style();
        if (parPresentationNode !== undefined) {
            if (styles !== undefined) {
                const pStyle = Xml.getStringValueFromNode(parPresentationNode, "w:pStyle");
                if (pStyle !== undefined) {
                    const namedStyle = styles.getNamedStyle(pStyle);
                    if (namedStyle !== undefined) {
                        parStyle = namedStyle;
                    }
                }
            }
            parStyle._justification = Xml.getStringValueFromNode(parPresentationNode, "w:jc");
        }
        return parStyle;
    }
    
    public static fromPresentationNode(styles: WordStyles | undefined, runPresentationNode: ChildNode): Style {
        const style = new Style();
        const basedOn = Xml.getStringValueFromNode(runPresentationNode, "w:basedOn");
        if (basedOn !== undefined && styles !== undefined) {
            const baseStyle = styles.getNamedStyle(basedOn);
            if (baseStyle !== undefined) {
                style.setBaseStyle(baseStyle);
            }
        }
        style._bold = Xml.getBooleanValueFromNode(runPresentationNode, "w:b");
        style._italic = Xml.getBooleanValueFromNode(runPresentationNode, "w:i");
        style._underlineMode = Xml.getStringValueFromNode(runPresentationNode, "w:u");
        style._strike = Xml.getBooleanValueFromNode(runPresentationNode, "w:strike");
        style._dstrike = Xml.getBooleanValueFromNode(runPresentationNode, "w:dstrike");
        const families = Style.getFontFamilyFromNode(runPresentationNode);
        style._fontFamily = families[Fonts.tryAddFonts(families)];
        style._fontSize = Xml.getNumberValueFromNode(runPresentationNode, "w:sz");
        style._spacing = Xml.getNumberValueFromNode(runPresentationNode, "w:spacing");
        style._color = Xml.getStringValueFromNode(runPresentationNode, "w:color");
        style._caps = Xml.getBooleanValueFromNode(runPresentationNode, "w:caps");
        style._smallCaps = Xml.getBooleanValueFromNode(runPresentationNode, "w:smallcaps");
        return style;
    }

    public get italic(): boolean {
        return this.getRecursive((style) => style._italic, false);
    }

    public get bold(): boolean {
        return this.getRecursive((style) => style._bold, false);
    }

    public get underlineMode(): string {
        return this.getRecursive((style) => style._underlineMode, "none");
    }

    public get strike(): boolean {
        return this.getRecursive((style) => style._strike, false);
    }

    public get doubleStrike(): boolean {
        return this.getRecursive((style) => style._dstrike, false);
    }

    public get fontFamily(): string {
        return this.getRecursive((style) => style._fontFamily, "Arial");
    }

    public get fontSize(): number {
        return this.getRecursive((style) => style._fontSize, 12);
    }

    public get spacing(): number {
        return this.getRecursive((style) => style._spacing, 0);
    }

    public get caps(): boolean {
        return this.getRecursive((style) => style._caps, false);
    }

    public get smallCaps(): boolean {
        return this.getRecursive((style) => style._smallCaps, false);
    }

    public get color(): string {
        return this.getRecursive((style) => style._color, "000000");
    }

    public get font(): string {
        return this.fontSize.toString() + " px "+ this.fontFamily;
    }

    public get justification(): string {
        return this.getRecursive((style) => style._justification, "left");
    }

    public setBaseStyle(baseStyle: Style): void {
        this.basedOn = baseStyle;
    }

    public updateFont(fontFamily: string, fontSize: number): void {
        this._fontFamily = fontFamily;
        this._fontSize = fontSize;
    }

    public toCss(): string {
        const prefix = "{\n";
        const bold = (this.bold) ? "bold " : " ";
        const italic = (this.italic) ? "italic " : " ";
        const font = "font: " + bold + italic + this.font + ";\n";
        const underlined = (this.underlineMode !== "none") ? "text-decoration: underline;\n" : "";
        // TODO: Spacing
        const caps = (this.caps) ? "text-transform: uppercase;\n" : "";
        // TODO: Small Caps
        const color = "fill: #"+ this.color + ";\n";
        const postfix = "}\n";
        return prefix + font + underlined + caps + color + postfix;
    }

    private getRecursive<T>(cb: (style: Style) => T | undefined, initial: T): T {
        let val: T | undefined = initial;
        const local = cb(this);
        if (local !== undefined) {
            val = local;
        } else {
            const basedOn = this.basedOn;
            if (basedOn !== undefined) {
                val = basedOn.getRecursive<T>(cb, initial);
            }
        }
        return val;
    }

    /**
     * Return fonts from specified node in reverse order.
     */
    private static getFontFamilyFromNode(styleNode: ChildNode): string[] {
        const fonts: string[] = ["Arial"];
        const fontNode = Xml.getFirstChildOfName(styleNode, "w:rFonts") as Element;
        if (fontNode !== undefined) {
            const csFont = fontNode.getAttribute("w:cs");
            if (csFont !== null) {
                fonts.push(...csFont.split(';'));
            }
        }
        return fonts;
    }
}