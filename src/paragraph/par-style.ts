import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { NamedStyles } from "../text/named-styles.js";
import { Style } from "../text/style.js";
import { NumberingStyle } from "../numbering/num-style.js";
import { AbstractNumberings } from "../numbering/abstract-numberings.js";

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
    public _basedOn: Style | undefined;
    private _basedOnId: string | undefined;
    public _justification: Justification | undefined = undefined;
    public _indentation: number | undefined;
    public _hanging: number | undefined;
    public _lineSpacing: number | undefined;
    public _lineRule: LineRule | undefined;
    public _numStyle: NumberingStyle | undefined;
    public _shadingColor: string | undefined;
    public _parSpacingBefore: number | undefined;
    public _parSpacingAfter: number | undefined;
    public _parLinesBefore: number | undefined;
    public _parLinesAfter: number | undefined;
    public _parAutoSpacingBefore: boolean | undefined;
    public _parAutoSpacingAfter: boolean | undefined;

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
                        parStyle._justification = Justification[justification as keyof typeof Justification];
                    }
                    break;
                case "w:ind":
                    const hangingAttr = Xml.getAttribute(child, "w:hanging");
                    if (hangingAttr !== undefined) {
                        parStyle._hanging = Metrics.convertTwipsToPixels(parseInt(hangingAttr, 10));
                    }
                    const leftAttr = Xml.getAttribute(child, "w:left");
                    if (leftAttr !== undefined) {
                        parStyle._indentation = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
                    }
                    break;
                case "w:numPr":
                    parStyle._numStyle = NumberingStyle.fromNumPresentationNode(child);
                    break;
                case "w:spacing":
                    parStyle.setLineSpacingFromNode(child);
                    parStyle.setParSpacingFromNode(child);
                    break;
                case "w:shd":
                    parStyle._shadingColor = Style.readShading(child);
                    break;
                case "w:widowControl":
                case "w:rPr":
                case "w:pBdr":
                case "w:contextualSpacing":
                case "w:keepLines":
                case "w:bidi":
                case "w:tabs":
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
                this._basedOn = baseStyle;
            }
        }
    }

    public applyNumberings(numberings: AbstractNumberings | undefined): void {
        if (this._numStyle !== undefined) {
            this._numStyle.applyNumberings(numberings);
        }
    }

    public toString(): string {
        const baseText = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const justText = (this._justification !== undefined) ? `jc=${this._justification.toString()}` : "";
        const indText = (this._indentation !== undefined) ? `ind=${this._indentation.toString()}` : "";
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