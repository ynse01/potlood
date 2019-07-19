import { NamedStyles } from "../text/named-styles.js";
import { Xml } from "../xml.js";
import { NumberingLevel } from "./numbering-level.js";

export class Numbering {
    private _levels: NumberingLevel[] = [];

    /**
     * Parse a Numbering from a w:abstractNum Node.
     */
    public static fromAbstractNumNode(styles: NamedStyles | undefined, node: ChildNode): Numbering {
        const numbering = new Numbering();
        Xml.getChildrenOfName(node, "w:lvl").forEach(levelNode => {
            const level = NumberingLevel.fromLevelNode(styles, levelNode);
            if (level !== undefined) {
                numbering._levels[level.index] = level;
            }
        });
        return numbering;
    }

    public getLevel(index: number): NumberingLevel {
        return this._levels[index];
    }
}