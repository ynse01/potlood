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
        parStyle._basedOnId = Xml.getStringValueFromNode(parPresentationNode, "w:pStyle");
        const justification = Xml.getStringValueFromNode(parPresentationNode, "w:jc");
        if (justification !== undefined) {
            parStyle._justification = Justification[justification as keyof typeof Justification];
        }
        parStyle._hanging = ParStyle.getHangingFromNode(parPresentationNode);
        parStyle._indentation = ParStyle.getIdentationFromNode(parPresentationNode);
        const numPrNode = Xml.getFirstChildOfName(parPresentationNode, "w:numPr");
        if (numPrNode !== undefined) {
            parStyle._numStyle = NumberingStyle.fromNumPresentationNode(numPrNode);
        }
        parStyle.setLineSpacingFromNode(parPresentationNode);
        parStyle.setParSpacingFromNode(parPresentationNode);
        parStyle.setShadingFromNode(parPresentationNode);
        return parStyle;
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

    private static getHangingFromNode(styleNode: ChildNode): number {
        let hanging = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind") as Element;
        if (indNode !== undefined) {
            const hangingAttr = Xml.getAttribute(indNode, "w:hanging");
            if (hangingAttr !== undefined) {
                hanging = Metrics.convertTwipsToPixels(parseInt(hangingAttr, 10));
            }
        }
        return hanging;
    }

    private static getIdentationFromNode(styleNode: ChildNode): number {
        let left = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind") as Element;
        if (indNode !== undefined) {
            const leftAttr = Xml.getAttribute(indNode, "w:left");
            if (leftAttr !== undefined) {
                left = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
            }
        }
        return left;
    }

    private setLineSpacingFromNode(styleNode: ChildNode): void {
        const spacingNode = Xml.getFirstChildOfName(styleNode, "w:spacing") as Element;
        if (spacingNode !== undefined) {
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
    }

    private setParSpacingFromNode(styleNode: ChildNode): void {
        const spacingNode = Xml.getFirstChildOfName(styleNode, "w:spacing") as Element;
        if (spacingNode !== undefined) {
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
                this._parAutoSpacingBefore = beforeAutoAttr === 'true';
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
                this._parAutoSpacingAfter = afterAutoAttr === 'true';
            }
        }
    }

    private setShadingFromNode(styleNode: ChildNode): void {
        const shadingNode = Xml.getFirstChildOfName(styleNode, "w:shd") as Element;
        if (shadingNode !== undefined) {
            // TODO: Parse patterns also.
            const fillAttr = Xml.getAttribute(shadingNode, "w:fill");
            if (fillAttr !== undefined) {
                this._shadingColor = fillAttr;
            }
        }
    }
}