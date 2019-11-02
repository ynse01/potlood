import { Justification } from "../paragraph/par-style.js";
import { TableBorderSet } from "./table-border-set.js";
import { TableMarginSet } from "./table-margin-set.js";
export class TableStyle {
    get justification() {
        return this._getValue(Justification.left, (style) => style._justification);
    }
    set justification(justification) {
        this._justification = justification;
    }
    get identation() {
        return this._getValue(0, (style) => style._identation);
    }
    set identation(indentation) {
        this._identation = indentation;
    }
    get borders() {
        return this._getValue(new TableBorderSet(), (style) => style._borders);
    }
    set borders(borders) {
        this._borders = borders;
    }
    get hasBordersDefined() {
        return this._borders !== undefined;
    }
    get margins() {
        return this._getValue(new TableMarginSet(), (style) => style._margins);
    }
    set margins(margins) {
        this._margins = margins;
    }
    get cellSpacing() {
        return this._getValue(0, (style) => style._cellSpacing);
    }
    set cellSpacing(cellSpacing) {
        this._cellSpacing = cellSpacing;
    }
    get gridSpan() {
        return this._getValue(1, (style) => style._gridSpan);
    }
    set gridSpan(gridSpan) {
        this._gridSpan = gridSpan;
    }
    get shading() {
        return this._getValue("", (style) => style._shading);
    }
    set shading(shading) {
        this._shading = shading;
    }
    _getValue(defaultValue, cb) {
        let val = cb(this);
        if (val === undefined && this.higherStyle !== undefined) {
            val = cb(this.higherStyle);
        }
        if (val === undefined) {
            val = defaultValue;
        }
        return val;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFdkQsTUFBTSxPQUFPLFVBQVU7SUFXbkIsSUFBVyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELElBQVcsYUFBYSxDQUFDLGFBQTRCO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxJQUFXLFVBQVUsQ0FBQyxXQUFtQjtRQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksY0FBYyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsSUFBVyxPQUFPLENBQUMsT0FBdUI7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQVcsaUJBQWlCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQVcsT0FBTztRQUNkLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELElBQVcsT0FBTyxDQUFDLE9BQXVCO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFXLFdBQVc7UUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxJQUFXLFdBQVcsQ0FBQyxXQUFtQjtRQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxJQUFXLFFBQVEsQ0FBQyxRQUFnQjtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxJQUFXLE9BQU8sQ0FBQyxPQUFlO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFTyxTQUFTLENBQUksWUFBZSxFQUFFLEVBQXdDO1FBQzFFLElBQUksR0FBRyxHQUFrQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ3JELEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ25CLEdBQUcsR0FBRyxZQUFZLENBQUM7U0FDdEI7UUFDRCxPQUFPLEdBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0oifQ==