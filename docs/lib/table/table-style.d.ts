import { Justification } from "../paragraph/par-style.js";
import { TableBorderSet } from "./table-border-set.js";
import { TableMarginSet } from "./table-margin-set.js";
export declare class TableStyle {
    higherStyle: TableStyle | undefined;
    width: number | undefined;
    private _justification;
    private _identation;
    private _borders;
    private _margins;
    private _cellSpacing;
    private _gridSpan;
    private _shading;
    justification: Justification;
    identation: number;
    borders: TableBorderSet;
    readonly hasBordersDefined: boolean;
    margins: TableMarginSet;
    cellSpacing: number;
    gridSpan: number;
    shading: string;
    private _getValue;
}
