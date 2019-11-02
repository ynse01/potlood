import { AbstractNumberings } from "./abstract-numberings.js";
import { Style } from "../text/style.js";
export declare class NumberingStyle {
    private index;
    private numId;
    private level;
    static fromNumPresentationNode(numPrNode: ChildNode | undefined): NumberingStyle | undefined;
    constructor(numId: number, index: number);
    getPrefixText(): string;
    readonly style: Style;
    applyNumberings(numberings: AbstractNumberings | undefined): void;
}
