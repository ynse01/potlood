import { Shape } from "./shape.js";

export class PresetShapeFactory {
    private static creators: any = {
        "ellipse": PresetShapeFactory._createEllipse
    }

    public createShape(name: string): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const creator: () => Shape = PresetShapeFactory.creators[name];
        if (creator !== undefined) {
            shape = creator();
        }
        return shape;
    }

    private static _createEllipse(): Shape {
        return new Shape();
    }
}