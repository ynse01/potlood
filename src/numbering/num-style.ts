import { AbstractNumberings } from "./abstract-numberings.js";
import { Xml } from "../utils/xml.js";
import { NumberingLevel } from "./numbering-level.js";
import { Style } from "../text/style.js";

export class NumberingStyle {
    private index: number;
    private numId: number; 
    private level: NumberingLevel | undefined;

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

    constructor(numId: number, index: number) {
        this.numId = numId;
        this.index = index;
    }

    public getPrefixText(): string {
        return (this.level) ? this.level.getText([0]) : "";
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
                this.level = numbering.getLevel(this.index);
            } else {
                console.log(`Could not find numbering ID ${this.numId}`);
            }
        }
    }
}