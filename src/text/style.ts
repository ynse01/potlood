import { NamedStyles } from "./named-styles.js";
import { ParStyle, Justification, LineRule } from "../paragraph/par-style.js";
import { RunStyle, UnderlineMode } from "./run-style.js";
import { Xml } from "../utils/xml.js";
import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { TableStyle } from "../table/table-style.js";
import { Emphasis } from "./positioned-text-line.js";

export class Style {
    private _basedOn: Style | undefined;
    private _basedOnId: string | undefined;

    public runStyle: RunStyle;
    public parStyle: ParStyle;
    public tableStyle: TableStyle | undefined;

    public static fromStyleNode(styleNode: ChildNode): Style {
        let parStyle: ParStyle | undefined = undefined;
        let runStyle: RunStyle | undefined = undefined;
        const parNode = Xml.getFirstChildOfName(styleNode, "w:pPr");
        if (parNode !== undefined) {
            parStyle = ParStyle.fromParPresentationNode(parNode);
        }
        const runNode = Xml.getFirstChildOfName(styleNode, "w:rPr");
        if (runNode !== undefined) {
            runStyle = RunStyle.fromPresentationNode(runNode);
        }
        const style = new Style(parStyle, runStyle);
        style._basedOnId = Xml.getStringValueFromNode(styleNode, "w:basedOn");
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
        return this.getValue(UnderlineMode.none, undefined, (runStyle) => runStyle._underlineMode);
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
                let spacing = parStyle._lineSpacing;
                if (spacing !== undefined) {
                    const lineRule = parStyle._lineRule;
                    switch(lineRule) {
                        case LineRule.auto:
                            // Line Spacing is interpreted as 1/240th of a line.
                            const lineSize = style.fontSize * 1.08;
                            spacing = lineSize * spacing / 240; 
                        break;
                        default:
                            // Line spacing is interpreted as 1/20th of a point.
                            spacing = Metrics.convertTwipsToPixels(spacing);
                            break
                    }
                }
                return spacing;
            },
            undefined
        );
        if (complexSpacing === undefined) {
            complexSpacing = this.fontSize * 1.08;
        }
        return complexSpacing;
    }

    public get shadingColor(): string {
        return this.getValue("000000", (parStyle) => parStyle._shadingColor, (runStyle) => runStyle._shadingColor);
    }

    public getIndentation(inRun: InSequence, inParagaph: InSequence): number {
        let identation = this.getValue(0, (parStyle) => parStyle._indentation, undefined);
        if (
            (inParagaph === InSequence.First || inParagaph === InSequence.Only) &&
            (inRun === InSequence.First || inRun === InSequence.Only)
        ) {
            const hanging = this.getValue(undefined, (parStyle) => parStyle._hanging, undefined);
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
        return this.getValue(Justification.left, (parStyle) => parStyle._justification, undefined);
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
            if (val === undefined && this.runStyle._basedOn !== undefined) {
                // Secondly look at the base styles of the RUN style.
                val = this.runStyle._basedOn.getRecursive<T>(parCb, runCb);
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
                if (val === undefined && this.parStyle._numStyle !== undefined) {
                    // Fourthly look at the numbering style.
                    const numStyle = this.parStyle._numStyle.style;
                    if (numStyle !== undefined) {
                        val = this.parStyle._numStyle.style.getRecursive<T>(parCb, runCb);
                    }
                }
                if (val === undefined && this.parStyle._basedOn !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = this.parStyle._basedOn.getRecursive<T>(parCb, runCb);
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