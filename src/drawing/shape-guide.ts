import { Shape } from "./shape";

interface IFormula {
    readonly name: string;
    evaluate(guide: ShapeGuide): number;
}

class MultiplyDevideFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x * y) / z;
    }
}

class AddSubtractFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x + y) - z;
    }
}

class AddDevideFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x + y) / z;
    }
}

class IfElseFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x > 0) ? y : z;
    }
}

class AbsoluteFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return Math.abs(x);
    }
}

class ArcTanFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.atan2(y, x);
    }
}

class CosineArcTanFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x * Math.cos(Math.atan2(z, y)));
    }
}

class CosineFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return x * Math.cos(y);
    }
}

class MaximumFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.max(x, y);
    }
}

class MinimumFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.min(x, y);
    }
}

class ModuloFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return Math.sqrt(x * x + y * y + z * z);
    }
}

class PinFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (y < x) ? x : (y > z) ? z : y;
    }
}

class SineArcTanFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string, private z: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return x * Math.sin(Math.atan2(z, y));
    }
}

class SineFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return x * Math.sin(y);
    }
}

class SquareRootFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return Math.sqrt(x);
    }
}

class TangentFormula implements IFormula {

    constructor(public name: string, private x: string, private y: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return x * Math.tan(y);
    }
}

class LiteralValueFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return x;
    }
}

export class ShapeGuide {
    public shape: Shape;
    private _formulas: IFormula[] = [];
    private _variables: { name: string, val: number}[] = [];

    constructor(shape: Shape) {
        this.shape = shape;
    }

    public addFormula(formula: string, name: string): void {
        const parts = formula.split(' ');
        if (parts.length < 2) {
            console.log(`Invalid formula for shape guide: ${formula}`);
            return;
        }
        let form: IFormula | undefined = undefined;
        switch(parts[0]) {
            case "/*":
                form = new MultiplyDevideFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "+-":
                form = new AddSubtractFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "+/":
                form = new AddDevideFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "?:":
                form = new IfElseFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "abs":
                form = new AbsoluteFormula(name, parts[1]);
                break;
            case "at2":
                form = new ArcTanFormula(name, parts[1], parts[2]);
                break;
            case "cat2":
                form = new CosineArcTanFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "cos":
                form = new CosineFormula(name, parts[1], parts[2]);
                break;
            case "max":
                form = new MaximumFormula(name, parts[1], parts[2]);
                break;
            case "min":
                form = new MinimumFormula(name, parts[1], parts[2]);
                break;
            case "mod":
                form = new ModuloFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "pin":
                form = new PinFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "sat2":
                form = new SineArcTanFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "sin":
                form = new SineFormula(name, parts[1], parts[2]);
                break;
            case "sqrt":
                form = new SquareRootFormula(name, parts[1]);
                break;
            case "tan":
                form = new TangentFormula(name, parts[1], parts[2]);
                break;
            case "val":
                form = new LiteralValueFormula(name, parts[1]);
                break;
            default:
                console.log(`Don't know how to interpret formula: ${parts[0]}`);
                break;
        }
        if (form !== undefined) {
            this._formulas.push(form);
        }
    }

    public getValue(statement: string): number {
        let val: number;
        const isNumber = /^(\d|-)/.test(statement);
        if (isNumber) {
            val = parseInt(statement);
        } else {
            val = this._getVariableValue(statement);
        }
        return val;
    }

    public evuluate(): void {
        this._formulas.forEach(formula => {
            const name = formula.name;
            const val = formula.evaluate(this);
            this._setVariable(name, val);
        })
    }

    private _getVariableValue(name: string): number {
        const val = this._variables.find((current) => current.name === name);
        return (val !== undefined) ? val.val : Number.NaN;
    }

    private _setVariable(name: string, value: number): void {
        this._variables.push({ name: name, val: value});
    }
}