import { Shape } from "./shape.js";
import { Point } from "../math/point.js";
import { Ellipse } from "../math/ellipse.js";

export class PresetShapeFactory {
    private static creators: any = {
        "line": PresetShapeFactory._createLine,
        "square": PresetShapeFactory._createSquare,
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
        } else {
            console.log(`Not sure how to draw a ${name}.`);
        }
        return shape;
    }

    private static _createBlockArc(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0, 1));
        shape.addSegmentArc(new Ellipse(new Point(0.5, 1), 0.5, 0.5), 0, false, true);
        shape.addSegmentLine(new Point(0.8, 1));
        shape.addSegmentArc(new Ellipse(new Point(0.5, 1), 0.3, 0.3), Math.PI, false, false);
        shape.addSegmentClose();
        return shape;
    }

    private static _createDiamond(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0.5, 0));
        shape.addSegmentLine(new Point(0, 0.5));
        shape.addSegmentLine(new Point(0.5, 1));
        shape.addSegmentLine(new Point(1, 0.5));
        shape.addSegmentClose();
        return shape;
    }

    private static _createEllipse(): Shape {
        const shape = new Shape();
        const ellipse = new Ellipse(new Point(0.5, 0.5), 0.5, 0.5);
        shape.addSegmentMove(new Point(1, 0.5));
        shape.addSegmentArc(ellipse.clone(), Math.PI / 2, false, true);
        shape.addSegmentArc(ellipse.clone(), Math.PI, false, true);
        shape.addSegmentArc(ellipse.clone(), 3 * Math.PI / 2, false, true);
        shape.addSegmentArc(ellipse.clone(), 0, false, true);
        shape.addSegmentClose();
        return shape;
    }

    private static _createFlowChartCollate(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0, 0));
        shape.addSegmentLine(new Point(1, 0));
        shape.addSegmentLine(new Point(0, 1));
        shape.addSegmentLine(new Point(1, 1));
        shape.addSegmentClose();
        return shape;
    }

    private static _createFlowChartPunchedCard(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0.2, 0));
        shape.addSegmentLine(new Point(1, 0));
        shape.addSegmentLine(new Point(1, 1));
        shape.addSegmentLine(new Point(0, 1));
        shape.addSegmentLine(new Point(0, 0.2));
        shape.addSegmentClose();
        return shape;        
    }

    private static _createFlowChartSort(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0.5, 0));
        shape.addSegmentLine(new Point(1, 0.5));
        shape.addSegmentLine(new Point(0, 0.5));
        shape.addSegmentLine(new Point(0.5, 0));
        shape.addSegmentMove(new Point(0.5, 1));
        shape.addSegmentLine(new Point(1, 0.5));
        shape.addSegmentLine(new Point(0, 0.5));
        shape.addSegmentClose();
        return shape;
    }

    private static _createLine(): Shape {
        const line = new Shape();
        line.addSegmentMove(new Point(0, 0));
        line.addSegmentLine(new Point(1, 1));
        return line;
    }

    private static _createSmileyFace(): Shape {
        console.log("Not sure how to draw a SmileyFace");
        return new Shape();
    }

    private static _createSquare(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0, 0));
        shape.addSegmentLine(new Point(0, 1));
        shape.addSegmentLine(new Point(1, 1));
        shape.addSegmentLine(new Point(1, 0));
        shape.addSegmentClose();
        return shape;
    }

    private static _createTriangle(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0.5, 0));
        shape.addSegmentLine(new Point(0, 1));
        shape.addSegmentLine(new Point(1, 1));
        shape.addSegmentClose();
        return shape;
    }

    private static _createWedgeRectangularCallout(): Shape {
        const shape = new Shape();
        shape.addSegmentMove(new Point(0, 0));
        shape.addSegmentLine(new Point(1, 0));
        shape.addSegmentLine(new Point(1, 0.7));
        shape.addSegmentLine(new Point(0.4, 0.7));
        shape.addSegmentLine(new Point(0.1, 1));
        shape.addSegmentLine(new Point(0.15, 0.7));
        shape.addSegmentLine(new Point(0, 0.7));
        shape.addSegmentClose();
        return shape;        
    }

}