import { Style } from "../text/style.js";
import { Xml } from "../utils/xml.js";
export var NumberingFormat;
(function (NumberingFormat) {
    NumberingFormat["none"] = "none";
    NumberingFormat["bullet"] = "bullet";
    NumberingFormat["cardinalText"] = "cardinalText";
    NumberingFormat["chicago"] = "chicago";
    NumberingFormat["decimal"] = "decimal";
    NumberingFormat["decimalEnclosedCircle"] = "decimalEnclosedCircle";
    NumberingFormat["decimalEnclodedFullStop"] = "decimalEnclosedFullstop";
    NumberingFormat["decimalEnclosedParentheses"] = "decimalEnclosedParen";
    NumberingFormat["decimalZero"] = "decimalZero";
    NumberingFormat["lowerLetter"] = "lowerLetter";
    NumberingFormat["lowerRoman"] = "lowerRoman";
    NumberingFormat["ordinalText"] = "ordinalText";
    NumberingFormat["upperLetter"] = "upperLetter";
    NumberingFormat["upperRoman"] = "upperRoman";
})(NumberingFormat || (NumberingFormat = {}));
export var NumberingSuffix;
(function (NumberingSuffix) {
    NumberingSuffix["nothing"] = "nothing";
    NumberingSuffix["space"] = "space";
    NumberingSuffix["tab"] = "tab";
})(NumberingSuffix || (NumberingSuffix = {}));
export class NumberingLevel {
    constructor(index) {
        this.style = new Style();
        this.format = NumberingFormat.none;
        this.start = undefined;
        this.suffix = NumberingSuffix.tab;
        this.text = undefined;
        this.index = index;
    }
    static fromLevelNode(namedStyles, levelNode) {
        const indexAttr = Xml.getAttribute(levelNode, "w:ilvl");
        if (indexAttr === undefined) {
            return undefined;
        }
        const index = parseInt(indexAttr, 10);
        const level = new NumberingLevel(index);
        level.style = Style.fromStyleNode(levelNode);
        level.style.applyNamedStyles(namedStyles);
        level.start = Xml.getNumberValueFromNode(levelNode, "w:start");
        const suffix = Xml.getStringValueFromNode(levelNode, "w:suff");
        if (suffix !== undefined) {
            level.suffix = NumberingSuffix[suffix];
        }
        const format = Xml.getStringValueFromNode(levelNode, "w:numFormat");
        if (format !== undefined) {
            level.format = NumberingFormat[format];
        }
        level.text = Xml.getStringValueFromNode(levelNode, "w:lvlText");
        return level;
    }
    getText(indices) {
        if (this.text !== undefined) {
            return this.text;
        }
        return this.getFormatted(indices);
    }
    getFormatted(_indices) {
        let text;
        switch (this.format) {
            case NumberingFormat.bullet:
                text = "&#x2002;";
                break;
            case NumberingFormat.none:
            default:
                text = "";
                break;
        }
        return text;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyaW5nLWxldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL251bWJlcmluZy9udW1iZXJpbmctbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxNQUFNLENBQU4sSUFBWSxlQWVYO0FBZkQsV0FBWSxlQUFlO0lBQ3ZCLGdDQUFhLENBQUE7SUFDYixvQ0FBaUIsQ0FBQTtJQUNqQixnREFBNkIsQ0FBQTtJQUM3QixzQ0FBbUIsQ0FBQTtJQUNuQixzQ0FBbUIsQ0FBQTtJQUNuQixrRUFBK0MsQ0FBQTtJQUMvQyxzRUFBbUQsQ0FBQTtJQUNuRCxzRUFBbUQsQ0FBQTtJQUNuRCw4Q0FBMkIsQ0FBQTtJQUMzQiw4Q0FBMkIsQ0FBQTtJQUMzQiw0Q0FBeUIsQ0FBQTtJQUN6Qiw4Q0FBMkIsQ0FBQTtJQUMzQiw4Q0FBMkIsQ0FBQTtJQUMzQiw0Q0FBeUIsQ0FBQTtBQUM3QixDQUFDLEVBZlcsZUFBZSxLQUFmLGVBQWUsUUFlMUI7QUFFRCxNQUFNLENBQU4sSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3ZCLHNDQUFtQixDQUFBO0lBQ25CLGtDQUFlLENBQUE7SUFDZiw4QkFBVyxDQUFBO0FBQ2YsQ0FBQyxFQUpXLGVBQWUsS0FBZixlQUFlLFFBSTFCO0FBRUQsTUFBTSxPQUFPLGNBQWM7SUE4QnZCLFlBQVksS0FBYTtRQTVCbEIsVUFBSyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDM0IsV0FBTSxHQUFvQixlQUFlLENBQUMsSUFBSSxDQUFDO1FBQy9DLFVBQUssR0FBdUIsU0FBUyxDQUFDO1FBQ3RDLFdBQU0sR0FBb0IsZUFBZSxDQUFDLEdBQUcsQ0FBQztRQUM5QyxTQUFJLEdBQXVCLFNBQVMsQ0FBQztRQXlCeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQXhCTSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQW9DLEVBQUUsU0FBb0I7UUFDbEYsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3pCLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO1FBQ0QsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0QsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDdEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBc0MsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDdEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBc0MsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFNTSxPQUFPLENBQUMsT0FBaUI7UUFDNUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDcEI7UUFDRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVPLFlBQVksQ0FBQyxRQUFrQjtRQUNuQyxJQUFJLElBQVksQ0FBQztRQUNqQixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakIsS0FBSyxlQUFlLENBQUMsTUFBTTtnQkFDdkIsSUFBSSxHQUFHLFVBQVUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQztZQUMxQjtnQkFDSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNWLE1BQU07U0FDYjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiJ9