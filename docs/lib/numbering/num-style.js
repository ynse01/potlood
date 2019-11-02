import { Xml } from "../utils/xml.js";
export class NumberingStyle {
    constructor(numId, index) {
        this.numId = numId;
        this.index = index;
    }
    static fromNumPresentationNode(numPrNode) {
        let style = undefined;
        if (numPrNode) {
            const indexAttr = Xml.getStringValueFromNode(numPrNode, "w:ilvl");
            const numIdAttr = Xml.getStringValueFromNode(numPrNode, "w:numId");
            if (indexAttr !== undefined && numIdAttr !== undefined) {
                const index = parseInt(indexAttr);
                const numId = parseInt(numIdAttr);
                style = new NumberingStyle(numId, index);
            }
        }
        return style;
    }
    getPrefixText() {
        return (this.level) ? this.level.getText([0]) : "";
    }
    get style() {
        return this.level.style;
    }
    applyNumberings(numberings) {
        if (numberings !== undefined) {
            const numbering = numberings.getNumberingById(this.numId);
            this.level = numbering.getLevel(this.index);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL251bWJlcmluZy9udW0tc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXRDLE1BQU0sT0FBTyxjQUFjO0lBbUJ2QixZQUFZLEtBQWEsRUFBRSxLQUFhO1FBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFqQk0sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFNBQWdDO1FBQ2xFLElBQUksS0FBSyxHQUErQixTQUFTLENBQUM7UUFDbEQsSUFBSSxTQUFTLEVBQUU7WUFDWCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkUsSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzVDO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBT00sYUFBYTtRQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBTSxDQUFDLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRU0sZUFBZSxDQUFDLFVBQTBDO1FBQzdELElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUMxQixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0NBQ0oifQ==