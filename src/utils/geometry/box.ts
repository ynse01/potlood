import { InSequence } from "../in-sequence.js";
import { Point } from "./point.js";
import { TableBorderSet } from "../../table/table-border-set.js";
import { TableMarginSet } from "../../table/table-margin-set.js";

export class Box {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public get left(): number {
        return this.x;
    }

    public get top(): number {
        return this.y;
    }

    public get right(): number {
        return this.x + this.width;
    }

    public get bottom(): number {
        return this.y + this.height;
    }

    public get topLeft(): Point {
        return new Point(this.left, this.top);
    }

    public get topRight(): Point {
        return new Point(this.right, this.top);
    }

    public get bottomLeft(): Point {
        return new Point(this.left, this.bottom);
    }

    public get bottomRight(): Point {
        return new Point(this.right, this.bottom);
    }

    public translate(x: number, y: number): Box {
        return new Box(this.x + x, this.y + y, this.width, this.height);
    }

    public addBorder(left: number, top: number, right: number, bottom: number): Box {
        return new Box(this.x - left, this.y - top, this.width + left + right, this.height + top + bottom);
    }

    public addBordersAndMargins(set: TableBorderSet, margins: TableMarginSet, _rowOrder: InSequence, _columnOrder: InSequence): Box {
        const start = ((set.borderStart !== undefined) ? set.borderStart.size : 0) + margins.cellMarginStart;
        const end = ((set.borderEnd !== undefined) ? set.borderEnd.size : 0) + margins.cellMarginEnd;
        const top = ((set.borderTop !== undefined) ? set.borderTop.size : 0) + margins.cellMarginTop;
        const bottom = ((set.borderBottom !== undefined) ? set.borderBottom.size : 0) + margins.cellMarginBottom;
        return this.addBorder(start, top, end, bottom);
    }

    public addSpacing(spacing: number): Box {
        return this.addBorder(spacing, spacing, spacing, spacing);
    }

    public subtractBorder(left: number, top: number, right: number, bottom: number): Box {
        return new Box(this.x + left, this.y + top, this.width - left - right, this.height - top - bottom);
    }

    public subtractBordersAndMargins(set: TableBorderSet, margins: TableMarginSet, _rowOrder: InSequence, _columnOrder: InSequence): Box {
        const start = ((set.borderStart !== undefined) ? set.borderStart.size : 0) + margins.cellMarginStart;
        const end = ((set.borderEnd !== undefined) ? set.borderEnd.size : 0) + margins.cellMarginEnd;
        const top = ((set.borderTop !== undefined) ? set.borderTop.size : 0) + margins.cellMarginTop;
        const bottom = ((set.borderBottom !== undefined) ? set.borderBottom.size : 0) + margins.cellMarginBottom;
        return this.subtractBorder(start, top, end, bottom);
    }

    public subtractSpacing(spacing: number): Box {
        return this.subtractBorder(spacing, spacing, spacing, spacing);
    }

    public includePoint(x: number, y: number): Box;
    public includePoint(point: Point): Box;
    public includePoint(arg1: number | Point, arg2?: number): Box {
        const x = (arg1 instanceof Point) ? arg1.x : arg1;
        const y = (arg1 instanceof Point) ? arg1.y : arg2!;
        const newX = Math.min(this.x, x);
        const newY = Math.min(this.y, y);
        const newWidth = Math.max(this.x + this.width, x + this.width) - newX;
        const newHeight = Math.min(this.y + this.height, y + this.height) - newY;
        return new Box(newX, newY, newWidth, newHeight);
    }

    public placeInRectangle(width: number, height: number, xPos: InSequence, yPos: InSequence): Box {
        let x = 0;
        let y = 0;
        if (xPos === InSequence.Middle) {
            x = this.x + (this.width / 2) - (width / 2);
        } else if (xPos === InSequence.Last) {
            x = this.right - width;
        }
        if (yPos === InSequence.Middle) {
            y = this.y + (this.height / 2) - (height / 2);
        } else if (xPos === InSequence.Last) {
            y = this.bottom - height;
        }
        return new Box(x, y, width, height);
    }

    public addOnTopOf(other: Box, spacing: number = 0): Box {
        const width = Math.max(this.width, other.width);
        const height = this.height + other.height + spacing;
        return new Box(this.x, this.y, width, height);
    }

    public addInFrontOf(other: Box, spacing: number = 0): Box {
        const width = this.width + other.width + spacing;
        const height = Math.max(this.height, other.height);
        return new Box(this.x, this.y, width, height);
    }

    public intersectX(x: number): boolean {
        return this.left <= x && this.right >= x;
    }

    public intersectY(y: number): boolean {
        return this.top <= y && this.bottom >= y;
    }

    public intersectPoint(point: Point): boolean {
        return this.intersectX(point.x) && this.intersectY(point.y);
    }

    public clone(): Box {
        return new Box(this.x, this.y, this.width, this.height);
    }

    public toString(): string {
        return `{${this.x}, ${this.y}, ${this.width}, ${this.height}}`;
    }
}