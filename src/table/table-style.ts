import { Justification } from "../paragraph/par-style.js";
import { Borders } from "./borders.js";
import { Margins } from "./margins.js";

export class TableStyle {
    public higherStyle: TableStyle | undefined;
    public width: number | undefined;
    public justification: Justification | undefined;
    public identation: number | undefined;
    public borders: Borders = new Borders();
    public margins: Margins = new Margins();
    public cellSpacing: number = 0;
    public gridSpan: number = 1;
    public shading: string | undefined = undefined;

}
