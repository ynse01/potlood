import { Shape } from "./shape.js";
import { Vector } from "../math/vector.js";
import { Circle } from "../math/circle.js";

export class PresetShapeFactory {
    private static creators: any = {
        "line": PresetShapeFactory._createLine,
        "rect": PresetShapeFactory._createRectangle,
        "triangle": PresetShapeFactory._createTriangle,
        "diamond": PresetShapeFactory._createDiamond,
        "ellipse": PresetShapeFactory._createEllipse,
        "blockArc": PresetShapeFactory._createBlockArc,
        "smileyFace": PresetShapeFactory._createSmileyFace,
        "wedgeRectCallout": PresetShapeFactory._createWedgeRectangularCallout,
        "flowChartCollate": PresetShapeFactory._createFlowChartCollate,
        "flowChartPunchedCard": PresetShapeFactory._createFlowChartPunchedCard,
        "flowChartSort": PresetShapeFactory._createFlowChartSort
    }

    public createShape(name: string): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const creator: () => Shape = PresetShapeFactory.creators[name];
        if (creator !== undefined) {
            shape = creator();
        }
        return shape;
    }

    private static _createBlockArc(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0, 1));
        shape.addSegmentCircle(new Circle(new Vector(0.5, 1), 0.5), 0);
        shape.addSegmentLine(new Vector(0.8, 1));
        shape.addSegmentMove(new Vector(0, 1));
        shape.addSegmentLine(new Vector(0.2, 1));
        shape.addSegmentCircle(new Circle(new Vector(0.5, 1), 0.3), 0);
        shape.addSegmentLine(new Vector(0.8, 1));
        return shape;
    }

    private static _createDiamond(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0.5, 0));
        shape.addSegmentLine(new Vector(0, 0.5));
        shape.addSegmentLine(new Vector(0.5, 1));
        shape.addSegmentLine(new Vector(1, 0.5));
        shape.addSegmentLine(new Vector(0.5, 0));
        return shape;
    }

    private static _createEllipse(): Shape {
        return new Shape();
    }

    private static _createFlowChartCollate(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0, 0));
        shape.addSegmentLine(new Vector(1, 0));
        shape.addSegmentLine(new Vector(0, 1));
        shape.addSegmentLine(new Vector(1, 1));
        shape.addSegmentLine(new Vector(0, 0));
        return shape;
    }

    private static _createFlowChartPunchedCard(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0.2, 0));
        shape.addSegmentLine(new Vector(1, 0));
        shape.addSegmentLine(new Vector(1, 1));
        shape.addSegmentLine(new Vector(0, 1));
        shape.addSegmentLine(new Vector(0, 0.2));
        shape.addSegmentLine(new Vector(0.2, 0));
        return shape;        
    }

    private static _createFlowChartSort(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0.5, 0));
        shape.addSegmentLine(new Vector(1, 0.5));
        shape.addSegmentLine(new Vector(0, 0.5));
        shape.addSegmentLine(new Vector(0.5, 0));
        shape.addSegmentMove(new Vector(0.5, 1));
        shape.addSegmentLine(new Vector(1, 0.5));
        shape.addSegmentLine(new Vector(0, 0.5));
        shape.addSegmentLine(new Vector(0.5, 1));
        return shape;
    }

    private static _createLine(): Shape {
        const line = new Shape();
        line.addSegmentMove(new Vector(0, 0));
        line.addSegmentLine(new Vector(1, 1));
        return line;
    }

    private static _createRectangle(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0, 0));
        shape.addSegmentLine(new Vector(0, 1));
        shape.addSegmentLine(new Vector(1, 1));
        shape.addSegmentLine(new Vector(1, 0));
        shape.addSegmentLine(new Vector(0, 0));
        return shape;
    }

    private static _createSmileyFace(): Shape {
        return new Shape();
    }

    private static _createTriangle(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0.5, 0));
        shape.addSegmentLine(new Vector(0, 1));
        shape.addSegmentLine(new Vector(1, 1));
        shape.addSegmentLine(new Vector(0.5, 0));
        return shape;
    }

    private static _createWedgeRectangularCallout(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Vector(0, 0));
        shape.addSegmentLine(new Vector(1, 0));
        shape.addSegmentLine(new Vector(1, 0.7));
        shape.addSegmentLine(new Vector(0.4, 0.7));
        shape.addSegmentLine(new Vector(0.1, 1));
        shape.addSegmentLine(new Vector(0.15, 0.7));
        shape.addSegmentLine(new Vector(0, 0.7));
        shape.addSegmentLine(new Vector(0, 0));
        return shape;        
    }

}