import { Justification } from "../paragraph/par-style.js";
import { BordersAndMargins } from "./borders-and-margins.js";

export class TableStyle {
    public width: number | undefined;
    public justification: Justification | undefined;
    public identation: number | undefined;
    public borders: BordersAndMargins = new BordersAndMargins();
    }
