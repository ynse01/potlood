import { Section } from "../section.js";
import { ShapePositionReference } from "../drawing/shape-bounds.js";
import { TabStop } from "../paragraph/tab-stop.js";
import { Box } from "./math/box.js";

export class VirtualFlow {
    // private _width: number;
    private _xMin: number;
    private _xMax: number;
    // private _pageHeight: number;
    private _pos: number;
    private _lastParPos: number = 0;
    private _lastCharX: number = 0;
    private _stops: TabStop[] = [];
    private _nums: any = {};
    private _obstacles: Box[] = [];

    public static fromSection(section: Section | undefined): VirtualFlow {
        const flow = new VirtualFlow(40, 700 - 40);
        // this._width = content.clientWidth - 2 * 40;
        // this._pageHeight = 400;
        if (section !== undefined) {
            let pageWidth = 700;
            if (section.pageWidth !== undefined) {
                pageWidth = section.pageWidth;
            }
            const pageHeight = section.pageHeight;
            if (pageHeight !== undefined) {
                // this._pageHeight = Metrics.convertPointsToPixels(pageHeight);
            }
            const marginLeft = section.marginLeft;
            if (marginLeft !== undefined) {
                flow._xMin = marginLeft;
            }
            const marginRight = section.marginRight;
            if (marginRight !== undefined) {
                flow._xMax = pageWidth - marginRight;
            }
        };
        return flow;
    }

    constructor(xMin: number, xMax: number, position: number = 0) {
        this._xMin = xMin;
        this._xMax = xMax;
        this._pos = position;
    }

    public getX(needsWidth: number = 0): number {
        let x = this._xMin;
        const obstacle = this._getApplicableObstacle();
        if (obstacle !== undefined) {
            // Is obstacle all the width?
            const isWide = obstacle.width >= ((this._xMax - this._xMin) - needsWidth);
            if (isWide) {
                this.advancePosition(obstacle.height);
            } else {
                // TODO: Remove assumption that obstacle is to the left of the page
                x = obstacle.right;
            }
        }
        return x;
    }

    public getReferenceX(reference: ShapePositionReference, width: number): number {
        let x = this.getX(width);
        // TODO: Support more reference modes.
        switch(reference) {
            case ShapePositionReference.Character:
                x = this._lastCharX;
                break;
            case ShapePositionReference.None:
            case ShapePositionReference.Column:
            default:
                x = this._xMin;
                break;
        }
        return x;
    }

    public getY(): number {
        return this._pos;
    }

    public getMaxY(): number {
        let maxY = this._pos;
        this._obstacles.forEach(bounds => {
            maxY = Math.max(maxY, bounds.bottom);
        });
        return maxY;
    }

    public getReferenceY(reference: ShapePositionReference): number {
        let pos = this._pos;
        // TODO: Support more reference modes.
        switch(reference) {
            case ShapePositionReference.Paragraph:
                pos = this._lastParPos;
                break;
            default:
                pos = this._pos;
                break;
        }
        return pos;
    }

    public getWidth(): number {
        let width = this._xMax - this._xMin;
        const obstacle = this._getApplicableObstacle();
        if (obstacle !== undefined) {
            width -= obstacle.width;
        }
        return width;
    }

    public addObstacle(bounds: Box): void {
        this._obstacles.push(bounds);
    }

    public advanceX(startDelta: number, endDelta: number): VirtualFlow {
        this._xMin += startDelta;
        this._xMax -= startDelta - endDelta;
        return this;
    }

    public advancePosition(delta: number): VirtualFlow {
        this._pos += delta;
        return this;
    }

    public advanceNumbering(numId: number, level: number): void {
        const id = `${numId}-${level}`;
        const currentNum = this._nums[id];
        if (currentNum === undefined) {
            this._nums[id] = 2;
        } else {
            this._nums[id] = currentNum + 1;
        }
    }

    public getNumbering(numId: number, level: number): number {
        const id = `${numId}-${level}`;
        return this._nums[id] || 1;
    }

    public getTab(index: number): TabStop {
        return this._stops[index];
    }

    public addTabStop(tabStop: TabStop): void {
        this._stops.push(tabStop);
    }

    public removeTabStop(): void {
        this._stops.pop();
    }

    public mentionParagraphPosition(): void {
        this._lastParPos = this._pos;
    }

    public mentionCharacterPosition(xDelta: number): void {
        this._lastCharX = this._xMin + xDelta;
    }

    public clone(): VirtualFlow {
        const cloned = new VirtualFlow(this._xMin, this._xMax, this._pos);
        cloned._stops = this._stops;
        cloned._nums = this._nums;
        cloned._obstacles = this._obstacles;
        return cloned;
    }

    private _getApplicableObstacle(): Box | undefined {
        let found: Box | undefined = undefined;
        for (let i = 0; i < this._obstacles.length; i++) {
            if (this._obstacles[i].intersectY(this._pos)) {
                found = this._obstacles[i];
                break;
            }
        }
        return found;
    }
}