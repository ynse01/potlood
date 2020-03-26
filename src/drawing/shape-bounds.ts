import { Box } from "../utils/geometry/box.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Point } from "../utils/geometry/point.js";

export enum ShapeAnchorMode {
    /** Inline with the text */
    Inline,
    /** Floating on top os text */
    Floating
}

export enum ShapePositionReference {
    /** Not relative to any outside element */
    None,
    /** Relative to the current position in the run. X coordinate: character, Y coordinate: line */
    Character,
    /** Relative to the extents of the column containing this anchor, X coordinate only */
    Column,
    /** Relative to the Bottom or Right margin */
    EndMargin,
    /** Relative to the inside margin. X coordinate: left for oddpages, right for even pages. */
    InsideMargin,
    /** Relative to the page margins */
    Margin,
    /** Relative to the outside margin. X coordinate: right for oddpages, left for even pages. */
    OutsideMargin,
    /** Relative to the edge of the page */
    Page,
    /** Relative to the Paragraph containing this anchor. Y coordinate only. */
    Paragraph,
    /** Relative to the Top or Left margin */
    StartMargin
}

export enum ShapePositionAlignMode {
    /** Align with Right or Bottom of its Reference */
    End,
    /** Align with Center of its Reference */
    Center,
    /** Align with Inside of its Reference */
    Inside,
    /** Align with Outside of its Reference */
    Outside,
    /** Align with Left or Top of its Reference */
    Start
}

export class ShapeBounds {
    public offsetX: number = 0;
    public offsetY: number = 0;
    public referenceX = ShapePositionReference.None;
    public referenceY = ShapePositionReference.None;
    public referenceOffsetX: number = 0;
    public referenceOffsetY: number = 0;
    public alignX = ShapePositionAlignMode.Start;
    public alignY = ShapePositionAlignMode.Start;
    public sizeX: number = 0;
    public sizeY: number = 0;
    public flipHorizontal = false;
    public flipVertical = false;
    public rotation = 0;
    public anchor = ShapeAnchorMode.Inline;

    public getBox(flow: VirtualFlow): Box {
        const start = this._getStartPoint(flow);
        return new Box(start.x, start.y, this.sizeX, this.sizeY);
    }

    private _getStartPoint(flow: VirtualFlow): Point {
        let x = flow.getReferenceX(this.referenceX, this.sizeX);
        let y = flow.getReferenceY(this.referenceY);
        switch (this.referenceX) {
            case ShapePositionReference.None:
                x += this.offsetX;
                break;
            case ShapePositionReference.Column:
            default:
                x += this.referenceOffsetX;
                break;
        }
        switch (this.referenceY) {
            case ShapePositionReference.None:
                y += this.offsetY;
                break;
            case ShapePositionReference.Paragraph:
            default:
                y += this.referenceOffsetY;
                break;
        }
        return new Point(x, y);
    }
}