import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Box } from "../math/box.js";

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

    public static fromShapePropertiesNode(shapePropNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Floating;
        const frame = Xml.getFirstChildOfName(shapePropNode, "a:xfrm");
        if (frame !== undefined) {
            const flipH = Xml.getAttribute(frame, "flipH");
            if (flipH !== undefined) {
                bounds.flipHorizontal = true;
            }
            const flipV = Xml.getAttribute(frame, "flipV");
            if (flipV !== undefined) {
                bounds.flipVertical = true;
            }
            const rot = Xml.getAttribute(frame, "rot");
            if (rot !== undefined) {
                bounds.rotation = Metrics.convertRotationToRadians(parseInt(rot));
            }
            const offset = Xml.getFirstChildOfName(frame, "a:off");
            if (offset !== undefined) {
                const offsetX = Xml.getAttribute(offset, "x");
                if (offsetX !== undefined) {
                    bounds.offsetX = Metrics.convertEmuToPixels(parseInt(offsetX));
                }
                const offsetY = Xml.getAttribute(offset, "y");
                if (offsetY !== undefined) {
                    bounds.offsetY = Metrics.convertEmuToPixels(parseInt(offsetY));
                }
            }
            ShapeBounds._readExtent(frame, "a:ext", bounds);
        }
        return bounds;
    }

    public static fromInlineNode(inlineNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Inline;
        ShapeBounds._readExtent(inlineNode, "wp:extent", bounds);
        ShapeBounds._readHorizontalPosition(inlineNode, bounds);
        ShapeBounds._readVerticalPosition(inlineNode, bounds);
        return bounds;
    }

    public static fromAnchorNode(anchorNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Floating;
        ShapeBounds._readExtent(anchorNode, "wp:extent", bounds);
        ShapeBounds._readHorizontalPosition(anchorNode, bounds);
        ShapeBounds._readVerticalPosition(anchorNode, bounds);
        return bounds;
    }

    public get box(): Box {
        return new Box(this.offsetX, this.offsetY, this.sizeX, this.sizeY);
    }

    private static _readHorizontalPosition(parent: Node, bounds: ShapeBounds): void {
        const horPos = Xml.getFirstChildOfName(parent, "wp:positionH");
        if (horPos !== undefined) {
            const reference = this._readPositionReference(horPos);
            if (reference !== undefined) {
                bounds.referenceX = reference;
            }
            const referenceOffset = this._readPositionReferenceOffset(horPos);
            bounds.referenceOffsetX = referenceOffset;
            const align = this._readPositionAlignment(horPos);
            if (align !== undefined) {
                bounds.alignX = align;
            }
        }
    }

    private static _readVerticalPosition(parent: Node, bounds: ShapeBounds): void {
        const vertPos = Xml.getFirstChildOfName(parent, "wp:positionV");
        if (vertPos !== undefined) {
            const reference = this._readPositionReference(vertPos);
            if (reference !== undefined) {
                bounds.referenceY = reference;
            }
            const referenceOffset = this._readPositionReferenceOffset(vertPos);
            bounds.referenceOffsetY = referenceOffset;
            const align = this._readPositionAlignment(vertPos);
            if (align !== undefined) {
                bounds.alignY = align;
            }
        }
    }

    private static _readPositionReference(node: Node): ShapePositionReference | undefined {
        let reference: ShapePositionReference | undefined = undefined;
        const relativeFrom = Xml.getAttribute(node, "relativeFrom");
        if (relativeFrom !== undefined) {
            switch(relativeFrom.toLowerCase()) {
                case "character":
                case "line":
                    reference = ShapePositionReference.Character;
                    break;
                case "column":
                    reference = ShapePositionReference.Column;
                    break;
                case "leftmargin":
                case "topmargin":
                    reference = ShapePositionReference.StartMargin;
                    break;
                case "rightmargin":
                case "bottommargin":
                    reference = ShapePositionReference.EndMargin;
                    break;
                case "insidemargin":
                    reference = ShapePositionReference.InsideMargin;
                    break;
                case "outsidemargin":
                    reference = ShapePositionReference.OutsideMargin;
                    break;
                case "margin":
                    reference = ShapePositionReference.Margin;
                    break;
                case "page":
                    reference = ShapePositionReference.Page;
                    break;
                case "paragraph":
                    reference = ShapePositionReference.Paragraph;
                    break;
            }
        }
        return reference;
    }

    private static _readPositionAlignment(node: Node): ShapePositionAlignMode | undefined {
        let align: ShapePositionAlignMode | undefined = undefined;
        const alignNode = Xml.getFirstChildOfName(node, "wp:align");
        if (alignNode !== undefined && alignNode.textContent !== null) {
            switch(alignNode.textContent.toLowerCase()) {
                case "left":
                case "top":
                    align = ShapePositionAlignMode.Start;
                    break;
                case "right":
                case "bottom":
                    align = ShapePositionAlignMode.End;
                    break;
                case "inside":
                    align = ShapePositionAlignMode.Inside;
                    break;
                case "outside":
                    align = ShapePositionAlignMode.Outside;
                    break;
                case "center":
                    align = ShapePositionAlignMode.Center;
                    break;
            }
        }
        return align;
    }

    private static _readPositionReferenceOffset(node: Node): number {
        let offset: number = 0;
        const offsetNode = Xml.getFirstChildOfName(node, "wp:posOffset");
        if (offsetNode !== undefined && offsetNode.textContent !== null) {
            offset = Metrics.convertEmuToPixels(parseInt(offsetNode.textContent));
        }
        return offset;
    }

    private static _readExtent(parent: ChildNode, nodeName: string, bounds: ShapeBounds): void {
        const extent = Xml.getFirstChildOfName(parent, nodeName);
        if (extent !== undefined) {
            const extentX = Xml.getAttribute(extent, "cx");
            if (extentX !== undefined) {
                bounds.sizeX = Metrics.convertEmuToPixels(parseInt(extentX));
            }
            const extentY = Xml.getAttribute(extent, "cy");
            if (extentY !== undefined) {
                bounds.sizeY = Metrics.convertEmuToPixels(parseInt(extentY));
            }
        }
    }
}