import { MathObjectList } from "./math-object";

export class Equation {
    public objects: MathObjectList;

    constructor(objects: MathObjectList) {
        this.objects = objects;
    }
}