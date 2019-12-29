import { Shape } from "./shape";

interface IFormula {
    readonly name: string;
    evaluate(guide: ShapeGuide): number;
    toString(): string;
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

    public toString(): string {
        return `${this.name}: */ ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: +- ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: +* ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: ?: ${this.x} ${this.y} ${this.z}`;
    }
}

class AbsoluteFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return Math.abs(x);
    }

    public toString(): string {
        return `${this.name}: abs ${this.x}`;
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

    public toString(): string {
        return `${this.name}: at2 ${this.x} ${this.y}`;
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

    public toString(): string {
        return `${this.name}: cat2 ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: cos ${this.x} ${this.y}`;
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

    public toString(): string {
        return `${this.name}: max ${this.x} ${this.y}`;
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

    public toString(): string {
        return `${this.name}: min ${this.x} ${this.y}`;
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

    public toString(): string {
        return `${this.name}: mod ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: pin ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: sat2 ${this.x} ${this.y} ${this.z}`;
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

    public toString(): string {
        return `${this.name}: sin ${this.x} ${this.y}`;
    }
}

class SquareRootFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return Math.sqrt(x);
    }

    public toString(): string {
        return `${this.name}: sqrt ${this.x}`;
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

    public toString(): string {
        return `${this.name}: tan ${this.x} ${this.y}`;
    }
}

class LiteralValueFormula implements IFormula {

    constructor(public name: string, private x: string) {
    }

    public evaluate(guide: ShapeGuide): number {
        const x = guide.getValue(this.x);
        return x;
    }

    public toString(): string {
        return `${this.name}: val ${this.x}`;
    }
}

class FunctionFormula implements IFormula {
    constructor (public name: string, private func: (shape: Shape) => number) {
    }


    public evaluate(guide: ShapeGuide): number {
        return this.func(guide.shape);
    }

    
    public toString(): string {
        return `${this.name}: function`;
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
            case "*/":
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
            val = parseFloat(statement);
        } else {
            val = this._getVariableValue(statement);
        }
        return val;
    }

    public evaluate(): void {
        this._formulas.forEach(formula => {
            this._evaluateVariable(formula);
        })
    }

    private _getVariableValue(name: string): number {
        let val = this._variables.find((current) => current.name === name);
        if (val === undefined) {
            // Check pre-defined variables.
            // Taken from: https://social.msdn.microsoft.com/Forums/en-US/3f69ebb3-62a0-4fdd-b367-64790dfb2491/presetshapedefinitionsxml-does-not-specify-width-and-height-form-some-autoshapes?forum=os_binaryfile
            switch(name) {
                case "h":
                    // Height
                    val = this._createNamedVariable(new FunctionFormula("h", (shape: Shape) => shape.height));
                    break;
                case "hd2":
                    // Height / 2
                    val = this._createNamedVariable(new FunctionFormula("hd2", (shape: Shape) => shape.height / 2));
                    break;
                case "hd3":
                    // Height / 3
                    val = this._createNamedVariable(new FunctionFormula("hd3", (shape: Shape) => shape.height / 3));
                    break;
                case "hd4":
                    // Height / 4
                    val = this._createNamedVariable(new FunctionFormula("hd4", (shape: Shape) => shape.height / 4));
                    break;
                case "hd5":
                    // Height / 5
                    val = this._createNamedVariable(new FunctionFormula("hd5", (shape: Shape) => shape.height / 5));
                    break;
                case "hd6":
                    // Height / 6
                    val = this._createNamedVariable(new FunctionFormula("hd6", (shape: Shape) => shape.height / 6));
                    break;
                case "hd8":
                    // Height / 8
                    val = this._createNamedVariable(new FunctionFormula("hd8", (shape: Shape) => shape.height / 8));
                    break;
                case "w":
                    // Width
                    val = this._createNamedVariable(new FunctionFormula("w", (shape: Shape) => shape.width));
                    break;
                case "wd2":
                    // Width / 2
                    val = this._createNamedVariable(new FunctionFormula("wd2", (shape: Shape) => shape.width / 2));
                    break;
                case "wd3":
                    // Width / 3
                    val = this._createNamedVariable(new FunctionFormula("wd3", (shape: Shape) => shape.width / 3));
                    break;
                case "wd4":
                    // Width / 4
                    val = this._createNamedVariable(new FunctionFormula("wd4", (shape: Shape) => shape.width / 4));
                    break;
                case "wd5":
                    // Width / 5
                    val = this._createNamedVariable(new FunctionFormula("wd5", (shape: Shape) => shape.width / 5));
                    break;
                case "wd6":
                    // Width / 6
                    val = this._createNamedVariable(new FunctionFormula("wd6", (shape: Shape) => shape.width / 6));
                    break;
                case "wd8":
                    // Width / 8
                    val = this._createNamedVariable(new FunctionFormula("wd8", (shape: Shape) => shape.width / 8));
                    break;
                case "wd10":
                    // Width / 10
                    val = this._createNamedVariable(new FunctionFormula("wd10", (shape: Shape) => shape.width / 10));
                    break;
                case "cd2":
                    // 180 degrees or PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd2", (_shape: Shape) => Math.PI));
                    break;
                case "cd4":
                    // 90 degrees or half PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd4", (_shape: Shape) => Math.PI / 2));
                    break;
                case "cd8":
                    // 45 degrees or quarter PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd8", (_shape: Shape) => Math.PI / 4));
                    break;
                case "3cd4":
                    // 270 degrees or 1.5 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd4", (_shape: Shape) => 3 * Math.PI / 2));
                    break;
                case "3cd8":
                    // 135 degrees or 3/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd8", (_shape: Shape) => 3 * Math.PI / 4));
                    break;
                case "5cd8":
                    // 225 degrees or 5/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("5cd8", (_shape: Shape) => 5 * Math.PI / 4));
                    break;
                case "7cd8":
                    // 315 degrees or 7/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("7cd8", (_shape: Shape) => 7 * Math.PI / 4));
                    break;
                case "hc":
                    // Horizontal center
                    val = this._createNamedVariable(new FunctionFormula("hc", (shape: Shape) => shape.width / 2));
                    break;
                case "vc":
                    // Vertical center
                    val = this._createNamedVariable(new FunctionFormula("vc", (shape: Shape) => shape.height / 2));
                    break;
                case "t":
                    // Top
                    val = this._createNamedVariable(new FunctionFormula("t", (_shape: Shape) => 0));
                    break;
                case "b":
                    // Bottom
                    val = this._createNamedVariable(new FunctionFormula("b", (shape: Shape) => shape.height));
                    break;
                case "r":
                    // Right
                    val = this._createNamedVariable(new FunctionFormula("r", (shape: Shape) => shape.width));
                    break;
                case "l":
                    // Left
                    val = this._createNamedVariable(new FunctionFormula("l", (_shape: Shape) => 0));
                    break;
                case "ss":
                    // Short Side
                    val = this._createNamedVariable(new FunctionFormula("ss", (shape: Shape) => Math.min(shape.width, shape.height)));
                    break;
                case "ssd2":
                    // Short Side / 2
                    val = this._createNamedVariable(new FunctionFormula("ssd2", (shape: Shape) => Math.min(shape.width, shape.height) / 2));
                    break;
                case "ssd3":
                    // Short Side / 3
                    val = this._createNamedVariable(new FunctionFormula("ssd3", (shape: Shape) => Math.min(shape.width, shape.height) / 3));
                    break;
                case "ssd4":
                    // Short Side / 4
                    val = this._createNamedVariable(new FunctionFormula("ssd4", (shape: Shape) => Math.min(shape.width, shape.height) / 4));
                    break;
                case "ssd6":
                    // Short Side / 6
                    val = this._createNamedVariable(new FunctionFormula("ssd6", (shape: Shape) => Math.min(shape.width, shape.height) / 6));
                    break;
                case "ssd8":
                    // Short Side / 8
                    val = this._createNamedVariable(new FunctionFormula("ssd8", (shape: Shape) => Math.min(shape.width, shape.height) / 8));
                    break;
                case "ssd16":
                    // Short Side / 8
                    val = this._createNamedVariable(new FunctionFormula("ssd16", (shape: Shape) => Math.min(shape.width, shape.height) / 16));
                    break;
                case "ssd32":
                    // Short Side / 32
                    val = this._createNamedVariable(new FunctionFormula("ssd32", (shape: Shape) => Math.min(shape.width, shape.height) / 32));
                    break;
                case "ls":
                    // Long Side
                    val = this._createNamedVariable(new FunctionFormula("ls", (shape: Shape) => Math.max(shape.width, shape.height)));
                    break
                default:
                    const names = this._formulas.map(formula => formula.name).join(",");
                    console.log(`Unable to find variable ${name} in Shape Guide which defines variables: ${names}.`);
                    break;
            }
        }
        return (val !== undefined) ? val.val : Number.NaN;
    }

    private _evaluateVariable(formula: IFormula): void {
        this._variables.push(this._createNamedVariable(formula));
    }

    private _createNamedVariable(formula: IFormula): { name: string, val: number } {
        return { name: formula.name, val : formula.evaluate(this)};
    }
}