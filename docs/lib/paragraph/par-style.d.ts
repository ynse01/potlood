import { NamedStyles } from "../text/named-styles.js";
import { Style } from "../text/style.js";
import { NumberingStyle } from "../numbering/num-style.js";
import { AbstractNumberings } from "../numbering/abstract-numberings.js";
export declare enum Justification {
    center = "center",
    both = "both",
    left = "left",
    right = "right"
}
export declare enum LineRule {
    exactly = "exactly",
    atLeast = "atLeast",
    auto = "auto"
}
export declare class ParStyle {
    _basedOn: Style | undefined;
    private _basedOnId;
    _justification: Justification | undefined;
    _indentation: number | undefined;
    _hanging: number | undefined;
    _lineSpacing: number | undefined;
    _lineRule: LineRule | undefined;
    _numStyle: NumberingStyle | undefined;
    _shadingColor: string | undefined;
    _parSpacingBefore: number | undefined;
    _parSpacingAfter: number | undefined;
    _parLinesBefore: number | undefined;
    _parLinesAfter: number | undefined;
    _parAutoSpacingBefore: boolean | undefined;
    _parAutoSpacingAfter: boolean | undefined;
    static fromParPresentationNode(parPresentationNode: ChildNode): ParStyle;
    readonly spacingBefore: number;
    readonly spacingAfter: number;
    applyNamedStyles(namedStyles: NamedStyles | undefined): void;
    applyNumberings(numberings: AbstractNumberings | undefined): void;
    toString(): string;
    private static getHangingFromNode;
    private static getIdentationFromNode;
    private setLineSpacingFromNode;
    private setParSpacingFromNode;
}
