import { Style } from "./style.js";
import { XmlPart } from "../package/xml-part.js";
export declare class NamedStyles {
    private doc;
    private named;
    constructor(part: XmlPart);
    parseContent(): void;
    getNamedStyle(name: string): Style | undefined;
    printDebugInfo(): void;
}
