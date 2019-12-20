import { Shape } from "./shape.js";

export class ShapeReader {

    public readShape(_shapeNode: Node): Shape {
        return new Shape();
    }
}