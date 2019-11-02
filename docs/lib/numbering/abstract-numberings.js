import { Numbering } from "./numbering.js";
import { Xml } from "../utils/xml.js";
export class AbstractNumberings {
    constructor(part) {
        this._numberings = [];
        this.doc = part.document;
    }
    parseContent(styles) {
        if (this._numberings.length === 0) {
            const root = Xml.getFirstChildOfName(this.doc, "w:numbering");
            if (root !== undefined) {
                const abstractNumberings = [];
                root.childNodes.forEach(node => {
                    if (node.nodeName === "w:abstractNum") {
                        const abstractNumId = Xml.getAttribute(node, "w:abstractNumId");
                        if (abstractNumId !== undefined) {
                            const numbering = Numbering.fromAbstractNumNode(styles, node);
                            abstractNumberings[parseInt(abstractNumId)] = numbering;
                        }
                    }
                });
                root.childNodes.forEach(numNode => {
                    if (numNode.nodeName === "w:num") {
                        const numId = Xml.getAttribute(numNode, "w:numId");
                        const abstractNumId = Xml.getNumberValueFromNode(numNode, "w:abstractNumId");
                        if (numId !== undefined && abstractNumId !== undefined) {
                            this._numberings[parseInt(numId)] = abstractNumberings[abstractNumId];
                        }
                    }
                });
            }
        }
    }
    getNumberingById(numId) {
        return this._numberings[numId];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtbnVtYmVyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9udW1iZXJpbmcvYWJzdHJhY3QtbnVtYmVyaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3RDLE1BQU0sT0FBTyxrQkFBa0I7SUFLM0IsWUFBWSxJQUFhO1FBRmpCLGdCQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUdsQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVksQ0FBQyxNQUErQjtRQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM5RCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLE1BQU0sa0JBQWtCLEdBQWdCLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxlQUFlLEVBQUU7d0JBQ25DLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7d0JBQ2hFLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTs0QkFDN0IsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFDOUQsa0JBQWtCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO3lCQUMzRDtxQkFDSjtnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDOUIsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTt3QkFDOUIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQ25ELE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzt3QkFDN0UsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7NEJBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7eUJBQ3pFO3FCQUNKO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxLQUFhO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0oifQ==