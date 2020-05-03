import { NamedStyles } from "./named-styles";
import { ParStyle, Justification } from "../paragraph/par-style";
import { RunStyle, UnderlineMode } from "./run-style";
import { Xml } from "../utils/xml";
import { InSequence } from "../utils/in-sequence";
import { TableStyle } from "../table/table-style";
import { Emphasis } from "./positioned-text-line";

export class Style {
    private _basedOn: Style | undefined;
    private _basedOnId: string | undefined;

    public runStyle: RunStyle;
    public parStyle: ParStyle;
    public tableStyle: TableStyle | undefined;

    public static fromDocDefaultsNode(docDefaultsNode: ChildNode): Style {
        let parStyle: ParStyle | undefined = undefined;
        let runStyle: RunStyle | undefined = undefined;
        const runDefaults = Xml.getFirstChildOfName(docDefaultsNode, "w:rPrDefault");
        if (runDefaults !== undefined) {
            const runStyleNode = Xml.getFirstChildOfName(runDefaults, "w:rPr");
            if (runStyleNode !== undefined) {
                runStyle = RunStyle.fromPresentationNode(runStyleNode);
            }
        }
        const parDefaults = Xml.getFirstChildOfName(docDefaultsNode, "w:pPrDefault");
        if (parDefaults !== undefined) {
            const parStyleNode = Xml.getFirstChildOfName(parDefaults, "w:pPr");
            if (parStyleNode !== undefined) {
                parStyle = ParStyle.fromParPresentationNode(parStyleNode);
            }
        }
        return new Style(parStyle, runStyle);
    }

    public static fromStyleNode(styleNode: ChildNode): Style {
        let parStyle: ParStyle | undefined = undefined;
        let runStyle: RunStyle | undefined = undefined;
        let basedOnId: string | undefined = undefined;
        styleNode.childNodes.forEach(child => {
            // ISO/IEC 29500-1:2016 section: 17.7.4
            switch (child.nodeName) {
                case "w:pPr":
                    parStyle = ParStyle.fromParPresentationNode(child);
                    break;
                case "w:rPr":
                    runStyle = RunStyle.fromPresentationNode(child);
                    break;
                case "w:basedOn":
                    basedOnId = Xml.getStringValue(child);
                    break;
                case "w:name":
                case "w:aliases":
                case "w:autoRedefine":
                case "w:qFormat":
                case "w:semiHidden":
                case "w:uiPriority":
                case "w:unhideWhenUsed":
                case "w:rsid":
                case "w:locked":
                case "w:lsdException":
                case "w:personal":
                case "w:personalCompose":
                case "w:personalReply":
                    // Ignore
                    break;
                case "w:start":
                case "w:lvlText":
                case "w:lvlJc":
                case "w:numFmt":
                case "w:suff":
                    // Ignore, Numbering style related.
                    break;
                case "w:next":
                case "w:link":
                case "w:tblPr":
                case "w:hidden":
                case "w:latentStyles":
                case "w:pStyle":
                    // TODO: Read these attributes
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Style reading.`);
                    break;
            }
        });
        const style = new Style(parStyle, runStyle);
        style._basedOnId = basedOnId;
        return style;
    }

    public static readShading(shadingNode: ChildNode): string | undefined {
        let shadingColor: string | undefined = undefined;
        // TODO: Parse patterns also.
        const fillAttr = Xml.getAttribute(shadingNode, "w:fill");
        if (fillAttr !== undefined) {
            shadingColor = fillAttr;
        }
        return shadingColor;
    }

    constructor(parStyle?: ParStyle, runStyle?: RunStyle) {
        this.parStyle = (parStyle !== undefined) ? parStyle : new ParStyle();
        this.runStyle = (runStyle !== undefined) ? runStyle : new RunStyle();
    }

    public applyNamedStyles(namedStyles: NamedStyles | undefined): void {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
        if (this.runStyle !== undefined) {
            this.runStyle.applyNamedStyles(namedStyles);
        }
        if (this.parStyle !== undefined) {
            this.parStyle.applyNamedStyles(namedStyles);
        }
    }

    public get italic(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._italic);
    }

    public get bold(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._bold);
    }

    public get underlineMode(): UnderlineMode {
        return this.getValue(UnderlineMode.None, undefined, (runStyle) => runStyle._underlineMode);
    }

    public get strike(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._strike);
    }

    public get doubleStrike(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._dstrike);
    }

    public get fontFamily(): string {
        return this.getValue("Arial", undefined, (runStyle) => runStyle._fontFamily);
    }

    public get fontSize(): number {
        return this.getValue(12, undefined, (runStyle) => runStyle._fontSize);
    }

    public get charSpacing(): number {
        return this.getValue(0, undefined, (runStyle) => runStyle._charSpacing);
    }

    public get charStretch(): number {
        return this.getValue(1, undefined, (runStyle) => runStyle._charStretch);
    }

    public get lineSpacing(): number {
        const style = this;
        let complexSpacing = this.getValue(
            undefined,
            (parStyle) => {
                return parStyle.getLineSpacing(style);
            },
            undefined
        );
        if (complexSpacing === undefined) {
            complexSpacing = this.fontSize * 1.08;
        }
        return complexSpacing;
    }

    public get shadingColor(): string {
        return this.getValue("000000", (parStyle) => parStyle.shadingColor, (runStyle) => runStyle._shadingColor);
    }

    public getIndentation(inRun: InSequence, inParagaph: InSequence): number {
        let identation = this.getValue(0, (parStyle) => parStyle.indentation, undefined);
        if (
            (inParagaph === InSequence.First || inParagaph === InSequence.Only) &&
            (inRun === InSequence.First || inRun === InSequence.Only)
        ) {
            const hanging = this.getValue(undefined, (parStyle) => parStyle.hanging, undefined);
            if (hanging !== undefined) {
                identation -= hanging;
            }
        }
        return identation!;
    }

    public get caps(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._caps);
    }

    public get smallCaps(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._smallCaps);
    }

    public get color(): string {
        return this.getValue("000000", undefined, (runStyle) => runStyle._color);
    }

    public get justification(): Justification {
        return this.getValue(Justification.left, (parStyle) => parStyle.justification, undefined);
    }

    public get invisible(): boolean {
        return this.getValue(false, undefined, (runStyle) => runStyle._invisible);
    }

    public get emphasis(): Emphasis {
        let emphasis = Emphasis.Normal;
        if (this.bold) {
            emphasis |= Emphasis.Bold;
        }
        if (this.italic) {
            emphasis |= Emphasis.Italic;
        }
        if (this.smallCaps) {
            emphasis |= Emphasis.SmallCaps;
        }
        return emphasis;
    }

    public get font(): string {
        const italicText = (this.italic) ? "italic ": "";
        const boldText = (this.bold) ? "bold ": "";
        const font = italicText + boldText + Math.round(this.fontSize) + 'px ' + this.fontFamily;
        return font;
    }

    public toString(): string {
        const base = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const just = `jc=${this.justification.toString()}`;
        const ind = `ind=${this.getIndentation(InSequence.First, InSequence.First).toString()}`;
        const hang = `ind=${this.getIndentation(InSequence.Middle, InSequence.Middle).toString()}`;
        const i = `i=${this.italic}`;
        const b = `b=${this.bold.toString()}`;
        const u = `u=${this.underlineMode.toString()}`;
        const strike = `strike=${this.strike.toString()}`;
        const font = `font=${this.fontFamily.toString()}`;
        const size = `size=${this.fontSize.toString()}`;
        const dstrike = `dstrike=${this.doubleStrike.toString()}`;
        const charSpacing = `char_spacing=${this.charSpacing.toString()}`;
        const lineSpacing = `line_spacing=${this.lineSpacing.toString()}`;
        const color = `color=${this.color.toString()}`;
        const caps = `caps=${this.caps.toString()}`;
        const smallcaps = `smallcaps=${this.smallCaps.toString()}`;
        return `Style: ${base} ${just} ${ind} ${hang} ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${charSpacing} ${lineSpacing} ${color} ${caps} ${smallcaps}`;
    }

    private getValue<T>(initial: T, parCb?: (parStyle: ParStyle) => T | undefined, runCb?: (runStyle: RunStyle) => T | undefined): T {
        let val = this.getRecursive(parCb, runCb);
        // If still not defined, assign the initial value.
        if (val === undefined) {
            val = initial;
        }
        return val;
    }

    private getRecursive<T>(
        parCb?: (parStyle: ParStyle) => T | undefined,
        runCb?: (runStyle: RunStyle) => T | undefined,
        tableCb?: (runStyle: TableStyle) => T | undefined
    ): T | undefined {
        // Style hierarchy:
        // 1 Document defaults
        // 2 Table styles
        // 3 Numbering styles
        // 4 Paragraph styles
        // 5 Run styles
        // 6 Local Styles
        // We inspect the hierarchy backward, for performance reasons
        let val: T | undefined = undefined;
        // First look at local RUN presentation.
        if (this.runStyle !== undefined) {
            if (runCb !== undefined) {
                const localRun = runCb(this.runStyle);
                if (localRun !== undefined) {
                    val = localRun;
                }
            }
            const runParent = this.runStyle.parent;
            if (val === undefined && runParent !== undefined) {
                // Secondly look at the base styles of the RUN style.
                val = runParent.getRecursive<T>(parCb, runCb);
            }
        }
        // Thirdly look at local PARAGRAPH presentation.
        if (val === undefined) {
            if (this.parStyle !== undefined) {
                if (parCb !== undefined) {
                    const localPar = parCb(this.parStyle);
                    if (localPar !== undefined) {
                        val = localPar;
                    }
                }
                const parRunStyle = this.parStyle.runStyle;
                if (val === undefined && runCb !== undefined && parRunStyle !== undefined) {
                    val = runCb(parRunStyle);
                }
                if (val === undefined && this.parStyle.numStyle !== undefined) {
                    // Fourthly look at the numbering style.
                    const numStyle = this.parStyle.numStyle.style;
                    if (numStyle !== undefined) {
                        val = numStyle.getRecursive<T>(parCb, runCb);
                    }
                }
                const parParent = this.parStyle.parent;
                if (val === undefined && parParent !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = parParent.getRecursive<T>(parCb, runCb);
                }
            }
        }
        // Sixthly look at the Table Style.
        if (val === undefined) {
            if (this.tableStyle !== undefined) {
                if (tableCb !== undefined) {
                    const table = tableCb(this.tableStyle);
                    if (table !== undefined) {
                        val = table;
                    }
                }
            }
        }
        // Sevently look at the Style where this style is based upon.
        if (val === undefined) {
            const basedOn = this._basedOn;
            if (basedOn !== undefined) {
                val = basedOn.getRecursive<T>(parCb, runCb);
            }
        }
        return val;
    }
}