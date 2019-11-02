import { Style } from "./style.js";
import { Xml } from "../utils/xml.js";
export class NamedStyles {
    constructor(part) {
        this.named = {};
        this.doc = part.document;
    }
    parseContent() {
        if (this.named["Normal"] === undefined) {
            const root = Xml.getFirstChildOfName(this.doc, "w:styles");
            if (root !== undefined) {
                root.childNodes.forEach(node => {
                    if (node.nodeName === "w:style") {
                        const styleType = Xml.getAttribute(node, "w:type");
                        if (styleType !== undefined && styleType !== "numbering") {
                            const style = Style.fromStyleNode(node);
                            const styleId = Xml.getAttribute(node, "w:styleId");
                            if (styleId !== undefined) {
                                this.named[styleId] = style;
                            }
                        }
                    }
                });
            }
            for (const name in this.named) {
                if (this.named.hasOwnProperty(name)) {
                    const style = this.named[name];
                    style.applyNamedStyles(this);
                }
            }
        }
    }
    getNamedStyle(name) {
        return this.named[name];
    }
    printDebugInfo() {
        for (const name in this.named) {
            if (this.named.hasOwnProperty(name)) {
                const style = this.named[name];
                console.log(`${name}: ${style.toString()}`);
                if (style.parStyle) {
                    console.log(style.parStyle.toString());
                }
                if (style.runStyle) {
                    console.log(style.runStyle.toString());
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZWQtc3R5bGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RleHQvbmFtZWQtc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3RDLE1BQU0sT0FBTyxXQUFXO0lBSXBCLFlBQVksSUFBYTtRQUZqQixVQUFLLEdBQTZCLEVBQUUsQ0FBQztRQUd6QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQzdCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNuRCxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxLQUFLLFdBQVcsRUFBRTs0QkFDdEQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDeEMsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7NEJBQ3BELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQ0FDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7NkJBQy9CO3lCQUNKO3FCQUNKO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2FBQ047WUFDRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQy9CLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDaEM7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sY0FBYztRQUNqQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksS0FBSyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQzthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBQ0oifQ==