import { Shape } from "./shape.js";

export class PresetShapeFactory {
    private static creators: any = {};

    public static defineShape(name: string, shape: Shape) {
        this.creators[name] = () => shape.clone();
    }

    public createShape(name: string): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const creator: () => Shape = PresetShapeFactory.creators[name];
        if (creator !== undefined) {
            shape = creator();
        } else {
            console.log(`Not sure how to draw a ${name}.`);
        }
        return shape;
    }
}