import { Xml } from "../utils/xml";
import { Metrics } from "../utils/metrics";
import { ShapeBounds, ShapeAnchorMode, ShapePositionReference, ShapePositionAlignMode } from "./shape-bounds";

export class ShapeBoundsReader {

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
            ShapeBoundsReader._readExtent(frame, "a:ext", bounds);
        }
        return bounds;
    }

    public static fromInlineNode(inlineNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Inline;
        ShapeBoundsReader._readExtent(inlineNode, "wp:extent", bounds);
        ShapeBoundsReader._readHorizontalPosition(inlineNode, bounds);
        ShapeBoundsReader._readVerticalPosition(inlineNode, bounds);
        return bounds;
    }

    public static fromAnchorNode(anchorNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Floating;
        ShapeBoundsReader._readExtent(anchorNode, "wp:extent", bounds);
        ShapeBoundsReader._readHorizontalPosition(anchorNode, bounds);
        ShapeBoundsReader._readVerticalPosition(anchorNode, bounds);
        return bounds;
    }

    private static _readHorizontalPosition(parent: Node, bounds: ShapeBounds): void {
        const horPos = Xml.getFirstChildOfName(parent, "wp:positionH");
        if (horPos !== undefined) {
            const reference = ShapeBoundsReader._readPositionReference(horPos);
            if (reference !== undefined) {
                bounds.referenceX = reference;
            }
            const referenceOffset = ShapeBoundsReader._readPositionReferenceOffset(horPos);
            bounds.referenceOffsetX = referenceOffset;
            const align = ShapeBoundsReader._readPositionAlignment(horPos);
            if (align !== undefined) {
                bounds.alignX = align;
            }
        }
    }

    private static _readVerticalPosition(parent: Node, bounds: ShapeBounds): void {
        const vertPos = Xml.getFirstChildOfName(parent, "wp:positionV");
        if (vertPos !== undefined) {
            const reference = ShapeBoundsReader._readPositionReference(vertPos);
            if (reference !== undefined) {
                bounds.referenceY = reference;
            }
            const referenceOffset = ShapeBoundsReader._readPositionReferenceOffset(vertPos);
            bounds.referenceOffsetY = referenceOffset;
            const align = ShapeBoundsReader._readPositionAlignment(vertPos);
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