import { Shape } from "./shape.js";
import { Vector } from "../math/vector.js";

export class PresetShapeFactory {
    private static creators: any = {
        "line": PresetShapeFactory._createLine,
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
        return new Shape();
    }

    private static _createEllipse(): Shape {
        return new Shape();
    }

    private static _createFlowChartCollate(): Shape {
        return new Shape();
    }

    private static _createFlowChartPunchedCard(): Shape {
        return new Shape();
    }

    private static _createFlowChartSort(): Shape {
        return new Shape();
    }

    private static _createLine(): Shape {
        const line = new Shape();
        line.addMove(new Vector(0, 0));
        line.addLine(new Vector(1, 1));
        return line;
    }

    private static _createSmileyFace(): Shape {
        return new Shape();
    }

    private static _createWedgeRectangularCallout(): Shape {
        return new Shape();
    }

}