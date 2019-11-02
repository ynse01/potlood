import { NamedStyles } from "../text/named-styles.js";
import { NumberingLevel } from "./numbering-level.js";
export declare class Numbering {
    private _levels;
    /**
     * Parse a Numbering from a w:abstractNum Node.
     */
    static fromAbstractNumNode(styles: NamedStyles | undefined, node: ChildNode): Numbering;
    getLevel(index: number): NumberingLevel;
}
