export var ChartAxisPosition;
(function (ChartAxisPosition) {
    ChartAxisPosition[ChartAxisPosition["Top"] = 0] = "Top";
    ChartAxisPosition[ChartAxisPosition["Bottom"] = 1] = "Bottom";
    ChartAxisPosition[ChartAxisPosition["Left"] = 2] = "Left";
    ChartAxisPosition[ChartAxisPosition["Right"] = 3] = "Right";
})(ChartAxisPosition || (ChartAxisPosition = {}));
export var ChartAxisTickMode;
(function (ChartAxisTickMode) {
    ChartAxisTickMode[ChartAxisTickMode["None"] = 0] = "None";
    ChartAxisTickMode[ChartAxisTickMode["Outwards"] = 1] = "Outwards";
})(ChartAxisTickMode || (ChartAxisTickMode = {}));
export var ChartAxisLabelAlignment;
(function (ChartAxisLabelAlignment) {
    ChartAxisLabelAlignment[ChartAxisLabelAlignment["Center"] = 0] = "Center";
})(ChartAxisLabelAlignment || (ChartAxisLabelAlignment = {}));
export var ChartAxisCrossMode;
(function (ChartAxisCrossMode) {
    ChartAxisCrossMode[ChartAxisCrossMode["AutoZero"] = 0] = "AutoZero";
})(ChartAxisCrossMode || (ChartAxisCrossMode = {}));
export class ChartAxis {
    constructor(pos, major, minor, offset) {
        this.labelAlignment = ChartAxisLabelAlignment.Center;
        this.crossMode = ChartAxisCrossMode.AutoZero;
        this.position = pos;
        this.majorTickMode = major;
        this.minorTickMode = minor;
        this.labelOffset = offset;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtYXhpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jaGFydC9jaGFydC1heGlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE1BQU0sQ0FBTixJQUFZLGlCQUtYO0FBTEQsV0FBWSxpQkFBaUI7SUFDekIsdURBQUcsQ0FBQTtJQUNILDZEQUFNLENBQUE7SUFDTix5REFBSSxDQUFBO0lBQ0osMkRBQUssQ0FBQTtBQUNULENBQUMsRUFMVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBSzVCO0FBRUQsTUFBTSxDQUFOLElBQVksaUJBR1g7QUFIRCxXQUFZLGlCQUFpQjtJQUN6Qix5REFBSSxDQUFBO0lBQ0osaUVBQVEsQ0FBQTtBQUNaLENBQUMsRUFIVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBRzVCO0FBRUQsTUFBTSxDQUFOLElBQVksdUJBRVg7QUFGRCxXQUFZLHVCQUF1QjtJQUMvQix5RUFBTSxDQUFBO0FBQ1YsQ0FBQyxFQUZXLHVCQUF1QixLQUF2Qix1QkFBdUIsUUFFbEM7QUFFRCxNQUFNLENBQU4sSUFBWSxrQkFFWDtBQUZELFdBQVksa0JBQWtCO0lBQzFCLG1FQUFRLENBQUE7QUFDWixDQUFDLEVBRlcsa0JBQWtCLEtBQWxCLGtCQUFrQixRQUU3QjtBQUVELE1BQU0sT0FBTyxTQUFTO0lBUWxCLFlBQVksR0FBc0IsRUFBRSxLQUF3QixFQUFFLEtBQXdCLEVBQUUsTUFBYztRQUovRixtQkFBYyxHQUE0Qix1QkFBdUIsQ0FBQyxNQUFNLENBQUM7UUFFekUsY0FBUyxHQUF1QixrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFHL0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7SUFDOUIsQ0FBQztDQUNKIn0=