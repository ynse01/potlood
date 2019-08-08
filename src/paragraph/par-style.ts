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

export class ParStyle {
    public _basedOn: Style | undefined;
    private _basedOnId: string | undefined;
    public _justification: Justification | undefined = undefined;
    public _identation: number | undefined;
    public _hanging: number | undefined;
    public _spacing: number | undefined;
    public _numStyle: NumberingStyle | undefined;

    public static fromParPresentationNode(parPresentationNode: ChildNode): ParStyle {
        const parStyle = new ParStyle();
        parStyle._basedOnId = Xml.getStringValueFromNode(parPresentationNode, "w:pStyle");
        const justification = Xml.getStringValueFromNode(parPresentationNode, "w:jc");
        if (justification !== undefined) {
            parStyle._justification = Justification[justification as keyof typeof Justification];
        }
        parStyle._hanging = ParStyle.getHangingFromNode(parPresentationNode);
        parStyle._identation = ParStyle.getIdentationFromNode(parPresentationNode);
        const numPrNode = Xml.getFirstChildOfName(parPresentationNode, "w:numPr");
        if (numPrNode !== undefined) {
            parStyle._numStyle = NumberingStyle.fromNumPresentationNode(numPrNode);
        }
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
        const indText = (this._identation !== undefined) ? `ind=${this._identation.toString()}` : "";
        return `ParStyle: ${baseText} ${justText} ${indText}`;
    }

    private static getHangingFromNode(styleNode: ChildNode): number {
        let hanging = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind") as Element;
        if (indNode !== undefined) {
            const hangingAttr = Xml.getAttribute(indNode, "w:hanging");
            if (hangingAttr !== undefined) {
                hanging = Metrics.convertTwipsToPixels(-parseInt(hangingAttr, 10));
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
}