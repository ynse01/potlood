import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
export class ShapeBounds {
    constructor() {
        this.boundOffsetX = 0;
        this.boundOffsetY = 0;
        this.boundSizeX = 0;
        this.boundSizeY = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.rotation = 0;
        this.anchor = "";
    }
    static fromShapePropertiesNode(shapePropNode) {
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
    static fromInlineNode(inlineNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = "inline";
        ShapeBounds.setExtent(inlineNode, "wp:extent", bounds);
        return bounds;
    }
    static fromAnchorNode(anchorNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = "anchor";
        ShapeBounds.setExtent(anchorNode, "wp:extent", bounds);
        return bounds;
    }
    static setExtent(parent, nodeName, bounds) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtYm91bmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RyYXdpbmcvc2hhcGUtYm91bmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFOUMsTUFBTSxPQUFPLFdBQVc7SUFBeEI7UUFDVyxpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDdkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLFdBQU0sR0FBRyxFQUFFLENBQUM7SUErRHZCLENBQUM7SUE3RFUsTUFBTSxDQUFDLHVCQUF1QixDQUFDLGFBQXdCO1FBQzFELE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDakMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0MsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzthQUNoQztZQUNELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLElBQUksS0FBSyxLQUFLLFNB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