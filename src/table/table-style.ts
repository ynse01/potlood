import { Justification } from "../paragraph/par-style.js";
import { TableBorderSet } from "./table-border-set.js";
import { TableMarginSet } from "./table-margin-set.js";
import { InSequence } from "../utils/in-sequence.js";

export class TableStyle {
    public higherStyle: TableStyle | undefined;
    public width: number | undefined;
    private _justification: Justification | undefined;
    private _identation: number | undefined;
    private _borders: TableBorderSet | undefined;
    private _margins: TableMarginSet | undefined;
    private _cellSpacing: number | undefined;
    private _gridSpan: number | undefined;
    private _rowSpan: InSequence | undefined;
    private _shading: string | undefined;

    public get justification(): Justification {
        return this._getValue(Justification.left, (style) => style._justification);
    }

    public set justification(justification: Justification) {
        this._justification = justification;
    }

    public get identation(): number {
        return this._getValue(0, (style) => style._identation);
    }

    public set identation(indentation: number) {
        this._identation = indentation;
    }

    public get borders(): TableBorderSet {
        return this._getValue(new TableBorderSet(), (style) => style._borders);
    }

    public set borders(borders: TableBorderSet) {
        this._borders = borders;
    }

    public get hasBordersDefined(): boolean {
        return this._borders !== undefined;
    }

    public get margins(): TableMarginSet {
        return this._getValue(new TableMarginSet(), (style) => style._margins);
    }

    public set margins(margins: TableMarginSet) {
        this._margins = margins;
    }

    public get cellSpacing(): number {
        return this._getValue(0, (style) => style._cellSpacing);
    }

    public set cellSpacing(cellSpacing: number) {
        this._cellSpacing = cellSpacing;
    }

    public get gridSpan(): number {
        return this._getValue(1, (style) => style._gridSpan);
    }

    public set gridSpan(gridSpan: number) {
        this._gridSpan = gridSpan;
    }

    public get rowSpan(): InSequence {
        return this._getValue(InSequence.Only, (style) => style._rowSpan);
    }

    public set rowSpan(rowSpan: InSequence) {
        this._rowSpan = rowSpan;
    }

    public get shading(): string {
        return this._getValue("", (style) => style._shading);
    }

    public set shading(shading: string) {
        this._shading = shading;
    }

    private _getValue<T>(defaultValue: T, cb: (style: TableStyle) => T | undefined): T {
        let val: T | undefined = cb(this);
        if (val === undefined && this.higherStyle !== undefined) {
            val = cb(this.higherStyle);
        }
        if (val === undefined) {
            val = defaultValue;
        }
        return val!;
    }
}
