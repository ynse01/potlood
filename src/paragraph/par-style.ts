import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { NamedStyles } from "../text/named-styles.js";
import { Style } from "../text/style.js";
import { NumberingStyle } from "../numbering/num-style.js";
import { AbstractNumberings } from "../numbering/abstract-numberings.js";
import { TabStop } from "./tab-stop.js";
import { RunStyle } from "../text/run-style.js";

export enum Justification {
    center = "center",
    both = "both",
    left = "left",
    right = "right"
}

export enum LineRule {
    exactly = "exactly",
    atLeast = "atLeast",
    auto = "auto"
}

export class ParStyle {
    public basedOn: Style | undefined;
    private _basedOnId: string | undefined;
    public justification: Justification | undefined = undefined;
    public indentation: number | undefined;
    public hanging: number | undefined;
    private _lineSpacing: number | undefined;
    private _lineRule: LineRule | undefined;
    public numStyle: NumberingStyle | undefined;
    public shadingColor: string | undefined;
    private _parSpacingBefore: number | undefined;
    private _parSpacingAfter: number | undefined;
    private _parLinesBefore: number | undefined;
    private _parLinesAfter: number | undefined;
    private _parAutoSpacingBefore: boolean | undefined;
    private _parAutoSpacingAfter: boolean | undefined;
    public tabStops: TabStop[] | undefined;
    public runStyle: RunStyle | undefined;

    public static fromParPresentationNode(parPresentationNode: ChildNode): ParStyle {
        const parStyle = new ParStyle();
        parPresentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:pStyle":
                    parStyle._basedOnId = Xml.getStringValue(child);
                    break;
                case "w:jc":
                    const justification = Xml.getStringValue(child);
                    if (justification !== undefined) {
                        parStyle.justification = Justification[justification as keyof typeof Justification];
                    }
                    break;
                case "w:ind":
                    const hangingAttr = Xml.getAttribute(child, "w:hanging");
                    if (hangingAttr !== undefined) {
                        parStyle.hanging = Metrics.convertTwipsToPixels(parseInt(hangingAttr, 10));
                    }
                    const leftAttr = Xml.getAttribute(child, "w:left");
                    if (leftAttr !== undefined) {
                        parStyle.indentation = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
                    }
                    break;
                case "w:numPr":
                    parStyle.numStyle = NumberingStyle.fromNumPresentationNode(child);
                    break;
                case "w:spacing":
                    parStyle.setLineSpacingFromNode(child);
                    parStyle.setParSpacingFromNode(child);
                    break;
                case "w:shd":
                    parStyle.shadingColor = Style.readShading(child);
                    break;
                case "w:tabs":
                    parStyle.tabStops = TabStop.fromTabsNode(child);
                    break;
                case "w:rPr":
                    parStyle.runStyle = RunStyle.fromPresentationNode(child);
                    break;
                case "w:widowControl":
                case "w:snapToGrid":
                case "w:sectPr":
                case "w:pBdr":
                case "w:contextualSpacing":
                case "w:keepLines":
                case "w:bidi":
                case "w:keepNext":
                case "w:suppressAutoHyphens":
                case "w:suppressLineNumbers":
                case "w:outlineLvl":
                        // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during ParStyle reading.`);
                    break;
            }
        });
        return parStyle;
    }

    public getLineSpacing(style: Style): number | undefined {
        let spacing = this._lineSpacing;
        if (spacing !== undefined) {
            const lineRule = this._lineRule;
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
    }

    public setLineSpacing(spacing: number): void {
        this._lineSpacing = spacing;
        this._lineRule = LineRule.atLeast;
    }

    public get spacingBefore(): number {
        let spacing: number = 0;
        if (this._parLinesBefore !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesBefore * this._lineSpacing;
        } else if (this._parSpacingBefore !== undefined) {
            spacing = this._parSpacingBefore;
        } else if (this._parAutoSpacingBefore === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }

    public get spacingAfter(): number {
        let spacing: number = 0;
        if (this._parLinesAfter !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesAfter * this._lineSpacing;
        } else if (this._parSpacingAfter !== undefined) {
            spacing = this._parSpacingAfter;
        } else if (this._parAutoSpacingAfter === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }

    public applyNamedStyles(namedStyles: NamedStyles | undefined): void {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this.basedOn = baseStyle;
            }
        }
    }

    public applyNumberings(numberings: AbstractNumberings | undefined): void {
        if (this.numStyle !== undefined) {
            this.numStyle.applyNumberings(numberings);
        }
    }

    public clone(): ParStyle {
        const cloned = new ParStyle();
        cloned.basedOn = this.basedOn;
        cloned._basedOnId = this._basedOnId;
        cloned.justification = this.justification;
        cloned.indentation = this.indentation;
        cloned.hanging = this.hanging;
        cloned._lineSpacing = this._lineSpacing;
        cloned._lineRule = this._lineRule;
        cloned.numStyle = this.numStyle;
        cloned.shadingColor = this.shadingColor;
        cloned._parSpacingBefore = this._parSpacingBefore;
        cloned._parSpacingAfter = this._parSpacingAfter;
        cloned._parLinesBefore = this._parLinesBefore;
        cloned._parLinesAfter = this._parLinesAfter;
        cloned._parAutoSpacingBefore = this._parAutoSpacingBefore;
        cloned._parAutoSpacingAfter = this._parAutoSpacingAfter;
        cloned.tabStops = this.tabStops;
        return cloned;
    }

    public toString(): string {
        const baseText = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const justText = (this.justification !== undefined) ? `jc=${this.justification.toString()}` : "";
        const indText = (this.indentation !== undefined) ? `ind=${this.indentation.toString()}` : "";
        const lineText = (this._lineSpacing !== undefined) ? `line=${this._lineSpacing.toString()}` : "";
        return `ParStyle: ${baseText} ${justText} ${indText} ${lineText}`;
    }

    private setLineSpacingFromNode(spacingNode: ChildNode): void {
        const lineAttr = Xml.getAttribute(spacingNode, "w:line");
        if (lineAttr !== undefined) {
            this._lineSpacing = parseInt(lineAttr, 10);
            this._lineRule = LineRule.exactly;
        }
        const ruleAttr = Xml.getAttribute(spacingNode, "w:lineRule");
        if (ruleAttr !== undefined) {
            this._lineRule = LineRule[ruleAttr as keyof typeof LineRule];
        }
    }

    private setParSpacingFromNode(spacingNode: ChildNode): void {
        const beforeAttr = Xml.getAttribute(spacingNode, "w:before");
        if (beforeAttr !== undefined) {
            this._parSpacingBefore = Metrics.convertTwipsToPixels(parseInt(beforeAttr, 10));
        }
        const beforeLinesAttr = Xml.getAttribute(spacingNode, "w:beforeLines");
        if (beforeLinesAttr !== undefined) {
            this._parLinesBefore = parseInt(beforeLinesAttr, 10) / 100;
        }
        const beforeAutoAttr = Xml.getAttribute(spacingNode, "w:beforeAutospacing");
        if (beforeAutoAttr !== undefined) {
            this._parAutoSpacingBefore = Xml.attributeAsBoolean(beforeAutoAttr);
        }
        const afterAttr = Xml.getAttribute(spacingNode, "w:after");
        if (afterAttr !== undefined) {
            this._parSpacingAfter = Metrics.convertTwipsToPixels(parseInt(afterAttr, 10));
        }
        const afterLinesAttr = Xml.getAttribute(spacingNode, "w:afterLines");
        if (afterLinesAttr !== undefined) {
            this._parLinesAfter = parseInt(afterLinesAttr, 10) / 100;
        }
        const afterAutoAttr = Xml.getAttribute(spacingNode, "w:afterAutospacing");
        if (afterAutoAttr !== undefined) {
            this._parAutoSpacingAfter = Xml.attributeAsBoolean(afterAutoAttr);
        }
    }
}