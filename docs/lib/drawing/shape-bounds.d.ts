export declare class ShapeBounds {
    boundOffsetX: number;
    boundOffsetY: number;
    boundSizeX: number;
    boundSizeY: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
    rotation: number;
    anchor: string;
    static fromShapePropertiesNode(shapePropNode: ChildNode): ShapeBounds;
    static fromInlineNode(inlineNode: ChildNode): ShapeBounds;
    static fromAnchorNode(anchorNode: ChildNode): ShapeBounds;
    private static setExtent;
}
