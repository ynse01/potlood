import { Xml } from "../utils/xml.js";
import { Style } from "./style.js";
import { TextRun } from "./text-run.js";
import { RunStyle } from "./run-style.js";
export class TextReader {
    static readTextRun(runNode, parStyle, namedStyles) {
        const run = new TextRun([], new Style());
        const presentationNode = Xml.getFirstChildOfName(runNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        run.texts = TextReader._getTexts(runNode);
        run.style.applyNamedStyles(namedStyles);
        return run;
    }
    static _getTexts(runNode) {
        const texts = [];
        if (runNode.hasChildNodes) {
            runNode.childNodes.forEach((node) => {
                switch (node.nodeName) {
                    case "w:t":
                        const content = node.textContent;
                        if (content !== null) {
                            texts.push(content);
                        }
                        break;
                    case "w:br":
                    case "w:cr":
                        texts.push(" \n ");
                        break;
                    default:
                        // Ignore all other nodes
                        break;
                }
            });
        }
        return texts;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUkxQyxNQUFNLE9BQU8sVUFBVTtJQUNaLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBa0IsRUFBRSxRQUE4QixFQUFFLFdBQW9DO1FBQzlHLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLElBQUksZ0JBQWdCLEtBQUssU0FBUyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3BFLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQztRQUNELEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVPLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBa0I7UUFDdkMsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUN2QixPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNoQyxRQUFPLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2xCLEtBQUssS0FBSzt3QkFDTixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3dCQUNqQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7NEJBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ3ZCO3dCQUNELE1BQU07b0JBQ1YsS0FBSyxNQUFNLENBQUM7b0JBQ1osS0FBSyxNQUFNO3dCQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ25CLE1BQU07b0JBQ1Y7d0JBQ0kseUJBQXlCO3dCQUN6QixNQUFNO2lCQUNiO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSiJ9