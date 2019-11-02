import { Xml } from "../utils/xml.js";
export class Relationships {
    constructor() {
        this.relations = {};
    }
    static fromDocument(doc) {
        const relationships = new Relationships();
        doc.getRootNode().childNodes.forEach(relsNode => {
            relsNode.childNodes.forEach(relNode => {
                if (relNode.nodeName === "Relationship") {
                    const id = Xml.getAttribute(relNode, "Id");
                    const target = Xml.getAttribute(relNode, "Target");
                    const type = Xml.getAttribute(relNode, "Type");
                    if (id !== undefined && target !== undefined && type !== undefined) {
                        relationships.relations[id] = { target: target, type: type };
                    }
                }
            });
        });
        return relationships;
    }
    getTarget(id) {
        return this.relations[id].target;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpb25zaGlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrYWdlL3JlbGF0aW9uc2hpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXRDLE1BQU0sT0FBTyxhQUFhO0lBQTFCO1FBQ1ksY0FBUyxHQUFvRCxFQUFFLENBQUM7SUFzQjVFLENBQUM7SUFwQlUsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFnQjtRQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzVDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssY0FBYyxFQUFFO29CQUNyQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ25ELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUMvQyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO3dCQUNoRSxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7cUJBQ2hFO2lCQUNKO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxTQUFTLENBQUMsRUFBVTtRQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3JDLENBQUM7Q0FDSiJ9