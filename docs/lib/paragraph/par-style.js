import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "../text/style.js";
import { NumberingStyle } from "../numbering/num-style.js";
export var Justification;
(function (Justification) {
    Justification["center"] = "center";
    Justification["both"] = "both";
    Justification["left"] = "left";
    Justification["right"] = "right";
})(Justification || (Justification = {}));
export var LineRule;
(function (LineRule) {
    LineRule["exactly"] = "exactly";
    LineRule["atLeast"] = "atLeast";
    LineRule["auto"] = "auto";
})(LineRule || (LineRule = {}));
export class ParStyle {
    constructor() {
        this._justification = undefined;
    }
    static fromParPresentationNode(parPresentationNode) {
        const parStyle = new ParStyle();
        parStyle._basedOnId = Xml.getStringValueFromNode(parPresentationNode, "w:pStyle");
        const justification = Xml.getStringValueFromNode(parPresentationNode, "w:jc");
        if (justification !== undefined) {
            parStyle._justification = Justification[justification];
        }
        parStyle._hanging = ParStyle.getHangingFromNode(parPresentationNode);
        parStyle._indentation = ParStyle.getIdentationFromNode(parPresentationNode);
        const numPrNode = Xml.getFirstChildOfName(parPresentationNode, "w:numPr");
        if (numPrNode !== undefined) {
            parStyle._numStyle = NumberingStyle.fromNumPresentationNode(numPrNode);
        }
        parStyle.setLineSpacingFromNode(parPresentationNode);
        parStyle.setParSpacingFromNode(parPresentationNode);
        parStyle._shadingColor = Style.getShadingFromNode(parPresentationNode);
        return parStyle;
    }
    get spacingBefore() {
        let spacing = 0;
        if (this._parLinesBefore !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesBefore * this._lineSpacing;
        }
        else if (this._parSpacingBefore !== undefined) {
            spacing = this._parSpacingBefore;
        }
        else if (this._parAutoSpacingBefore === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }
    get spacingAfter() {
        let spacing = 0;
        if (this._parLinesAfter !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesAfter * this._lineSpacing;
        }
        else if (this._parSpacingAfter !== undefined) {
            spacing = this._parSpacingAfter;
        }
        else if (this._parAutoSpacingAfter === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
    }
    applyNumberings(numberings) {
        if (this._numStyle !== undefined) {
            this._numStyle.applyNumberings(numberings);
        }
    }
    toString() {
        const baseText = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const justText = (this._justification !== undefined) ? `jc=${this._justification.toString()}` : "";
        const indText = (this._indentation !== undefined) ? `ind=${this._indentation.toString()}` : "";
        const lineText = (this._lineSpacing !== undefined) ? `line=${this._lineSpacing.toString()}` : "";
        return `ParStyle: ${baseText} ${justText} ${indText} ${lineText}`;
    }
    static getHangingFromNode(styleNode) {
        let hanging = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind");
        if (indNode !== undefined) {
            const hangingAttr = Xml.getAttribute(indNode, "w:hanging");
            if (hangingAttr !== undefined) {
                hanging = Metrics.convertTwipsToPixels(parseInt(hangingAttr, 10));
            }
        }
        return hanging;
    }
    static getIdentationFromNode(styleNode) {
        let left = 0;
        const indNode = Xml.getFirstChildOfName(styleNode, "w:ind");
        if (indNode !== undefined) {
            const leftAttr = Xml.getAttribute(indNode, "w:left");
            if (leftAttr !== undefined) {
                left = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
            }
        }
        return left;
    }
    setLineSpacingFromNode(styleNode) {
        const spacingNode = Xml.getFirstChildOfName(styleNode, "w:spacing");
        if (spacingNode !== undefined) {
            const lineAttr = Xml.getAttribute(spacingNode, "w:line");
            if (lineAttr !== undefined) {
                this._lineSpacing = parseInt(lineAttr, 10);
                this._lineRule = LineRule.exactly;
            }
            const ruleAttr = Xml.getAttribute(spacingNode, "w:lineRule");
            if (ruleAttr !== undefined) {
                this._lineRule = LineRule[ruleAttr];
            }
        }
    }
    setParSpacingFromNode(styleNode) {
        const spacingNode = Xml.getFirstChildOfName(styleNode, "w:spacing");
        if (spacingNode !== undefined) {
            const beforeAttr = Xml.getAttribute(spacingNode, "w:before");
            if (beforeAttr !== undefined) {
                this._parSpacingBefore = Metrics.convertTwipsToPixels(parseInt(beforeAttr, 10));
            }
            const beforeLinesAttr = Xml.getAttribute(spacingNode, "w:beforeLines");
            if (beforeLinesAttr !== undefined) {
                this._parLinesBefore = parseInt(beforeLinesAttr, 10) / 100;
            }
            const beforeAutoAttr = Xml.getAttribute(spacingNode, "w:beforeAutospacing");
            if (beforeAutoAttr !== undefined) {
                this._parAutoSpacingBefore = Xml.attributeAsBoolean(beforeAutoAttr);
            }
            const afterAttr = Xml.getAttribute(spacingNode, "w:after");
            if (afterAttr !== undefined) {
                this._parSpacingAfter = Metrics.convertTwipsToPixels(parseInt(afterAttr, 10));
            }
            const afterLinesAttr = Xml.getAttribute(spacingNode, "w:afterLines");
            if (afterLinesAttr !== undefined) {
                this._parLinesAfter = parseInt(afterLinesAttr, 10) / 100;
            }
            const afterAutoAttr = Xml.getAttribute(spacingNode, "w:afterAutospacing");
            if (afterAutoAttr !== undefined) {
                this._parAutoSpacingAfter = Xml.attributeAsBoolean(afterAutoAttr);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXItc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzNELE1BQU0sQ0FBTixJQUFZLGFBS1g7QUFMRCxXQUFZLGFBQWE7SUFDckIsa0NBQWlCLENBQUE7SUFDakIsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYixnQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFMVyxhQUFhLEtBQWIsYUFBYSxRQUt4QjtBQUVELE1BQU0sQ0FBTixJQUFZLFFBSVg7QUFKRCxXQUFZLFFBQVE7SUFDaEIsK0JBQW1CLENBQUE7SUFDbkIsK0JBQW1CLENBQUE7SUFDbkIseUJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUFFRCxNQUFNLE9BQU8sUUFBUTtJQUFyQjtRQUdXLG1CQUFjLEdBQThCLFNBQVMsQ0FBQztJQW9KakUsQ0FBQztJQXRJVSxNQUFNLENBQUMsdUJBQXVCLENBQUMsbUJBQThCO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDaEMsUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEYsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUM3QixRQUFRLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxhQUEyQyxDQUFDLENBQUM7U0FDeEY7UUFDRCxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JFLFFBQVEsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDNUUsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFFLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN6QixRQUFRLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMxRTtRQUNELFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JELFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BELFFBQVEsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdkUsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQVcsYUFBYTtRQUNwQixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUN2RSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3REO2FBQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQzdDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7U0FDcEM7YUFBTSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDL0UsT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQVcsWUFBWTtRQUNuQixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUN0RSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1lBQzVDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7U0FDbkM7YUFBTSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDOUUsT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFdBQW9DO1FBQ3hELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM1RCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3RCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO2FBQzdCO1NBQ0o7SUFDTCxDQUFDO0lBRU0sZUFBZSxDQUFDLFVBQTBDO1FBQzdELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNYLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkcsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQy9GLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNqRyxPQUFPLGFBQWEsUUFBUSxJQUFJLFFBQVEsSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7SUFDdEUsQ0FBQztJQUVPLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFvQjtRQUNsRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQVksQ0FBQztRQUN2RSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDM0QsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUMzQixPQUFPLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNyRTtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFvQjtRQUNyRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBWSxDQUFDO1FBQ3ZFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNyRCxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLElBQUksR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQy9EO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sc0JBQXNCLENBQUMsU0FBb0I7UUFDL0MsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQVksQ0FBQztRQUMvRSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDM0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUNyQztZQUNELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzdELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBaUMsQ0FBQyxDQUFDO2FBQ2hFO1NBQ0o7SUFDTCxDQUFDO0lBRU8scUJBQXFCLENBQUMsU0FBb0I7UUFDOUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQVksQ0FBQztRQUMvRSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDM0IsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDN0QsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUMxQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNuRjtZQUNELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksZUFBZSxLQUFLLFNBQVMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUM5RDtZQUNELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDNUUsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFFO2dCQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDM0QsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqRjtZQUNELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUM1RDtZQUNELE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDMUUsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO2dCQUM3QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3JFO1NBQ0o7SUFDTCxDQUFDO0NBQ0oifQ==