import { Xml } from "../utils/xml.js";

export class Relationships {
    private relations: { [id: string]: {target: string, type: string}} = {};

    public static fromDocument(doc: XMLDocument): Relationships {
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

    public getTarget(id: string): string {
        return this.relations[id].target;
    }
}