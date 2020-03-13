import { MathObjectList } from "./math-object.js";

export class Equation {
    public objects: MathObjectList;

    constructor(objects: MathObjectList) {
        this.objects = objects;
    }
}