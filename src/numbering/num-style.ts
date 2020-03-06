import { AbstractNumberings } from "./abstract-numberings.js";
import { Xml } from "../utils/xml.js";
import { NumberingLevel } from "./numbering-level.js";
import { Style } from "../text/style.js";

export class NumberingStyle {
    public numId: number; 
    public level: NumberingLevel | undefined;
    private _levelIndex: number;

    public static fromNumPresentationNode(numPrNode: ChildNode | undefined): NumberingStyle | undefined {
        let style: NumberingStyle | undefined = undefined;
        if (numPrNode) {
            const indexAttr = Xml.getStringValueFromNode(numPrNode, "w:ilvl");
            const numIdAttr = Xml.getStringValueFromNode(numPrNode, "w:numId");
            if (indexAttr !== undefined && numIdAttr !== undefined) {
                const index = parseInt(indexAttr);
                const numId = parseInt(numIdAttr);
                style = new NumberingStyle(numId, index);
            }
        }
        return style;
    }

    constructor(numId: number, levelIndex: number) {
        this.numId = numId;
        this._levelIndex = levelIndex;
    }

    public getPrefixText(indices: number[]): string {
        return (this.level) ? this.level.getText(indices) : "";
    }

    public get style(): Style | undefined {
        let style: Style | undefined = undefined;
        if (this.level !== undefined) {
            style = this.level.style;
        }
        return style;
    }

    public applyNumberings(numberings: AbstractNumberings | undefined): void {
        if (numberings !== undefined) {
            const numbering = numberings.getNumberingById(this.numId);
            if (numbering !== undefined) {
                this.level = numbering.getLevel(this._levelIndex);
            } else {
                console.log(`Could not find numbering ID ${this.numId}`);
            }
        }
    }
}