import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Box } from "../math/box.js";

export class ShapeBounds {
    public boundOffsetX: number = 0;
    public boundOffsetY: number = 0;
    public boundSizeX: number = 0;
    public boundSizeY: number = 0;
    public flipHorizontal = false;
    public flipVertical = false;
    public rotation = 0;
    public anchor = "";

    public static fromShapePropertiesNode(shapePropNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = "absolute";
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
                    bounds.boundOffsetX = Metrics.convertEmuToPixels(parseInt(offsetX));
                }
                const offsetY = Xml.getAttribute(offset, "y");
                if (offsetY !== undefined) {
                    bounds.boundOffsetY = Metrics.convertEmuToPixels(parseInt(offsetY));
                }
            }
            ShapeBounds.setExtent(frame, "a:ext", bounds);
        }
        return bounds;
    }

    public static fromInlineNode(inlineNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = "inline";
        ShapeBounds.setExtent(inlineNode, "wp:extent", bounds);
        
        return bounds;
    }

    public static fromAnchorNode(anchorNode: ChildNode): ShapeBounds {
        const bounds = new ShapeBounds();
        bounds.anchor = "anchor";
        ShapeBounds.setExtent(anchorNode, "wp:extent", bounds);
        return bounds;
    }

    public get rectangle(): Box {
        return new Box(this.boundOffsetX, this.boundOffsetY, this.boundSizeX, this.boundSizeY);
    }

    private static setExtent(parent: ChildNode, nodeName: string, bounds: ShapeBounds): void {
        const extent = Xml.getFirstChildOfName(parent, nodeName);
        if (extent !== undefined) {
            const extentX = Xml.getAttribute(extent, "cx");
            if (extentX !== undefined) {
                bounds.boundSizeX = Metrics.convertEmuToPixels(parseInt(extentX));
            }
            const extentY = Xml.getAttribute(extent, "cy");
            if (extentY !== undefined) {
                bounds.boundSizeY = Metrics.convertEmuToPixels(parseInt(extentY));
            }
        }
    }
}