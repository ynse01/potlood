import { Xml } from "./utils/xml.js";
import { Section } from "./section.js";
import { TableReader } from "./table/table-reader.js";
import { ParagraphReader } from "./paragraph/paragraph-reader.js";
export class DocumentX {
    constructor(pack, part) {
        this.pars = [];
        this.pack = pack;
        this.part = part;
    }
    parseContent() {
        if (this.pars.length === 0) {
            const doc = Xml.getFirstChildOfName(this.part.document, "w:document");
            if (doc !== undefined) {
                const body = Xml.getFirstChildOfName(doc, "w:body");
                if (body !== undefined) {
                    body.childNodes.forEach(node => {
                        switch (node.nodeName) {
                            case "w:p":
                                this.pars.push(ParagraphReader.readParagraph(this, node));
                                break;
                            case "w:tbl":
                                this.pars.push(TableReader.readTable(this, node));
                                break;
                            case "w:sectPr":
                                this._section = new Section(this, node);
                                break;
                            default:
                                console.log("Don't know how to parse " + node.nodeName);
                                break;
                        }
                    });
                }
            }
        }
    }
    performLayout(flow) {
        this.parseContent();
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
    }
    get relationships() {
        return this._rels;
    }
    get styles() {
        return this._styles;
    }
    get numberings() {
        return this._numberings;
    }
    setRelationships(relationships) {
        this._rels = relationships;
    }
    setNamedStyles(styles) {
        this._styles = styles;
    }
    setNumberings(numberings) {
        this._numberings = numberings;
    }
    get paragraphs() {
        return this.pars;
    }
    get section() {
        return this._section;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnQteC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kb2N1bWVudC14LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBT3ZDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFbEUsTUFBTSxPQUFPLFNBQVM7SUFVbEIsWUFBWSxJQUFhLEVBQUUsSUFBYTtRQVJoQyxTQUFJLEdBQTBCLEVBQUUsQ0FBQztRQVNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sWUFBWTtRQUNmLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN0RSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3BELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzNCLFFBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDbEIsS0FBSyxLQUFLO2dDQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQzFELE1BQU07NEJBQ1YsS0FBSyxPQUFPO2dDQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELE1BQU07NEJBQ1YsS0FBSyxVQUFVO2dDQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN4QyxNQUFNOzRCQUNWO2dDQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUN4RCxNQUFNO3lCQUNiO29CQUNMLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUI7UUFDbEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxhQUE0QjtRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQztJQUMvQixDQUFDO0lBRU0sY0FBYyxDQUFDLE1BQW1CO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFTSxhQUFhLENBQUMsVUFBOEI7UUFDL0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELElBQVcsT0FBTztRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0NBQ0oifQ==