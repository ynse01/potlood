import { XmlPart } from "../package/xml-part.js";
import { Numbering } from "./numbering.js";
import { NamedStyles } from "../text/named-styles.js";
export declare class AbstractNumberings {
    private doc;
    private _numberings;
    constructor(part: XmlPart);
    parseContent(styles: NamedStyles | undefined): void;
    getNumberingById(numId: number): Numbering;
}
