import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";
import { WordStyles } from "./word-styles.js";
import { Style } from "./style.js";

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
    public _spacing: number | undefined;

    public static fromParPresentationNode(parPresentationNode: ChildNode): ParStyle {
        const parStyle = new ParStyle();
        parStyle._basedOnId = Xml.getStringValueFromNode(parPresentationNode, "w:pStyle");
        const justification = Xml.getStringValueFromNode(parPresentationNode, "w:jc");
        if (justification !== undefined) {
            parStyle._justification = Justification[justification as keyof typeof Justification];
        }
        parStyle._identation = ParStyle.getIdentationFromNode(parPresentationNode);
        return parStyle;
    }

    public applyNamedStyles(namedStyles: WordStyles | undefined): void {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
    }

    public toString(): string {
        const baseText = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const justText = (this._justification !== undefined) ? `jc=${this._justification.toString()}` : "";
        const indText = (this._identation !== undefined) ? `ind=${this._identation.toString()}` : "";
        return `ParStyle: ${baseText} ${justText} ${indText}`;
    }

    private static getIdentationFromNode(styleNode: ChildNode): number {
        let left = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind") as Element;
        if (indNode !== undefined) {
            const hangingAttr = indNode.getAttribute("w:hanging");
            if (hangingAttr !== null) {
                left = Metrics.convertTwipsToPixels(-parseInt(hangingAttr, 10));
            } else {
                const leftAttr = indNode.getAttribute("w:left");
                if (leftAttr !== null) {
                    left = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
                }
            }
        }
        return left;
    }
}