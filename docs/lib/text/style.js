import { ParStyle, Justification, LineRule } from "../paragraph/par-style.js";
import { RunStyle, UnderlineMode } from "./run-style.js";
import { Xml } from "../utils/xml.js";
import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
export class Style {
    constructor(parStyle, runStyle) {
        this.parStyle = (parStyle !== undefined) ? parStyle : new ParStyle();
        this.runStyle = (runStyle !== undefined) ? runStyle : new RunStyle();
    }
    static fromStyleNode(styleNode) {
        let parStyle = undefined;
        let runStyle = undefined;
        const parNode = Xml.getFirstChildOfName(styleNode, "w:pPr");
        if (parNode !== undefined) {
            parStyle = ParStyle.fromParPresentationNode(parNode);
        }
        const runNode = Xml.getFirstChildOfName(styleNode, "w:rPr");
        if (runNode !== undefined) {
            runStyle = RunStyle.fromPresentationNode(runNode);
        }
        const style = new Style(parStyle, runStyle);
        style._basedOnId = Xml.getStringValueFromNode(styleNode, "w:basedOn");
        return style;
    }
    static getShadingFromNode(styleNode) {
        let shadingColor = undefined;
        const shadingNode = Xml.getFirstChildOfName(styleNode, "w:shd");
        if (shadingNode !== undefined) {
            // TODO: Parse patterns also.
            const fillAttr = Xml.getAttribute(shadingNode, "w:fill");
            if (fillAttr !== undefined) {
                shadingColor = fillAttr;
            }
        }
        return shadingColor;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
        if (this.runStyle !== undefined) {
            this.runStyle.applyNamedStyles(namedStyles);
        }
        if (this.parStyle !== undefined) {
            this.parStyle.applyNamedStyles(namedStyles);
        }
    }
    get italic() {
        return this.getValue(false, undefined, (runStyle) => runStyle._italic);
    }
    get bold() {
        return this.getValue(false, undefined, (runStyle) => runStyle._bold);
    }
    get underlineMode() {
        return this.getValue(UnderlineMode.none, undefined, (runStyle) => runStyle._underlineMode);
    }
    get strike() {
        return this.getValue(false, undefined, (runStyle) => runStyle._strike);
    }
    get doubleStrike() {
        return this.getValue(false, undefined, (runStyle) => runStyle._dstrike);
    }
    get fontFamily() {
        return this.getValue("Arial", undefined, (runStyle) => runStyle._fontFamily);
    }
    get fontSize() {
        return this.getValue(12, undefined, (runStyle) => runStyle._fontSize);
    }
    get charSpacing() {
        return this.getValue(0, undefined, (runStyle) => runStyle._charSpacing);
    }
    get charStretch() {
        return this.getValue(1, undefined, (runStyle) => runStyle._charStretch);
    }
    get lineSpacing() {
        const style = this;
        let complexSpacing = this.getValue(undefined, (parStyle) => {
            let spacing = parStyle._lineSpacing;
            if (spacing !== undefined) {
                const lineRule = parStyle._lineRule;
                switch (lineRule) {
                    case LineRule.auto:
                        // Line Spacing is interpreted as 1/240th of a line.
                        const lineSize = style.fontSize * 1.08;
                        spacing = lineSize * spacing / 240;
                        break;
                    default:
                        // Line spacing is interpreted as 1/20th of a point.
                        spacing = Metrics.convertTwipsToPixels(spacing);
                        break;
                }
            }
            return spacing;
        }, undefined);
        if (complexSpacing === undefined) {
            complexSpacing = this.fontSize * 1.08;
        }
        return complexSpacing;
    }
    get shadingColor() {
        return this.getValue("000000", (parStyle) => parStyle._shadingColor, (runStyle) => runStyle._shadingColor);
    }
    getIndentation(inRun, inParagaph) {
        let identation = this.getValue(0, (parStyle) => parStyle._indentation, undefined);
        if ((inParagaph === InSequence.First || inParagaph === InSequence.Only) &&
            (inRun === InSequence.First || inRun === InSequence.Only)) {
            const hanging = this.getValue(undefined, (parStyle) => parStyle._hanging, undefined);
            if (hanging !== undefined) {
                identation -= hanging;
            }
        }
        return identation;
    }
    get caps() {
        return this.getValue(false, undefined, (runStyle) => runStyle._caps);
    }
    get smallCaps() {
        return this.getValue(false, undefined, (runStyle) => runStyle._smallCaps);
    }
    get color() {
        return this.getValue("000000", undefined, (runStyle) => runStyle._color);
    }
    get justification() {
        return this.getValue(Justification.left, (parStyle) => parStyle._justification, undefined);
    }
    get invisible() {
        return this.getValue(false, undefined, (runStyle) => runStyle._invisible);
    }
    get font() {
        const italicText = (this.italic) ? "italic " : "";
        const boldText = (this.bold) ? "bold " : "";
        const font = italicText + boldText + Math.round(this.fontSize) + 'px ' + this.fontFamily;
        return font;
    }
    toString() {
        const base = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const just = `jc=${this.justification.toString()}`;
        const ind = `ind=${this.getIndentation(InSequence.First, InSequence.First).toString()}`;
        const hang = `ind=${this.getIndentation(InSequence.Middle, InSequence.Middle).toString()}`;
        const i = `i=${this.italic}`;
        const b = `b=${this.bold.toString()}`;
        const u = `u=${this.underlineMode.toString()}`;
        const strike = `strike=${this.strike.toString()}`;
        const font = `font=${this.fontFamily.toString()}`;
        const size = `size=${this.fontSize.toString()}`;
        const dstrike = `dstrike=${this.doubleStrike.toString()}`;
        const charSpacing = `char_spacing=${this.charSpacing.toString()}`;
        const lineSpacing = `line_spacing=${this.lineSpacing.toString()}`;
        const color = `color=${this.color.toString()}`;
        const caps = `caps=${this.caps.toString()}`;
        const smallcaps = `smallcaps=${this.smallCaps.toString()}`;
        return `Style: ${base} ${just} ${ind} ${hang} ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${charSpacing} ${lineSpacing} ${color} ${caps} ${smallcaps}`;
    }
    getValue(initial, parCb, runCb) {
        let val = this.getRecursive(parCb, runCb);
        // If still not defined, assign the initial value.
        if (val === undefined) {
            val = initial;
        }
        return val;
    }
    getRecursive(parCb, runCb, tableCb) {
        // Style hierarchy:
        // 1 Document defaults
        // 2 Table styles
        // 3 Numbering styles
        // 4 Paragraph styles
        // 5 Run styles
        // 6 Local Styles
        // We inspect the hierarchy backward, for performance reasons
        let val = undefined;
        // First look at local RUN presentation.
        if (this.runStyle !== undefined) {
            if (runCb !== undefined) {
                const localRun = runCb(this.runStyle);
                if (localRun !== undefined) {
                    val = localRun;
                }
            }
            if (val === undefined && this.runStyle._basedOn !== undefined) {
                // Secondly look at the base styles of the RUN style.
                val = this.runStyle._basedOn.getRecursive(parCb, runCb);
            }
        }
        // Thirdly look at local PARAGRAPH presentation.
        if (val === undefined) {
            if (this.parStyle !== undefined) {
                if (parCb !== undefined) {
                    const localPar = parCb(this.parStyle);
                    if (localPar !== undefined) {
                        val = localPar;
                    }
                }
                if (val === undefined && this.parStyle._numStyle !== undefined) {
                    // Fourthly look at the numbering style.
                    const numStyle = this.parStyle._numStyle.style;
                    if (numStyle !== undefined) {
                        val = this.parStyle._numStyle.style.getRecursive(parCb, runCb);
                    }
                }
                if (val === undefined && this.parStyle._basedOn !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = this.parStyle._basedOn.getRecursive(parCb, runCb);
                }
            }
        }
        // Sixthly look at the Table Style.
        if (val === undefined) {
            if (this.tableStyle !== undefined) {
                if (tableCb !== undefined) {
                    const table = tableCb(this.tableStyle);
                    if (table !== undefined) {
                        val = table;
                    }
                }
            }
        }
        // Sevently look at the Style where this style is based upon.
        if (val === undefined) {
            const basedOn = this._basedOn;
            if (basedOn !== undefined) {
                val = basedOn.getRecursive(parCb, runCb);
            }
        }
        return val;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC9zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzlDLE1BQU0sT0FBTyxLQUFLO0lBcUNkLFlBQVksUUFBbUIsRUFBRSxRQUFtQjtRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLENBQUM7UUFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDO0lBQ3pFLENBQUM7SUFoQ00sTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFvQjtRQUM1QyxJQUFJLFFBQVEsR0FBeUIsU0FBUyxDQUFDO1FBQy9DLElBQUksUUFBUSxHQUF5QixTQUFTLENBQUM7UUFDL0MsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsUUFBUSxHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4RDtRQUNELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLFFBQVEsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckQ7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBb0I7UUFDakQsSUFBSSxZQUFZLEdBQXVCLFNBQVMsQ0FBQztRQUNqRCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBWSxDQUFDO1FBQzNFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUMzQiw2QkFBNkI7WUFDN0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUN4QixZQUFZLEdBQUcsUUFBUSxDQUFDO2FBQzNCO1NBQ0o7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBT00sZ0JBQWdCLENBQUMsV0FBb0M7UUFDeEQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzVELE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7YUFDN0I7U0FDSjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMvQztRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMvQztJQUNMLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDWCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELElBQVcsWUFBWTtRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxJQUFXLFdBQVc7UUFDbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQzlCLFNBQVMsRUFDVCxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ1QsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztZQUNwQyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BDLFFBQU8sUUFBUSxFQUFFO29CQUNiLEtBQUssUUFBUSxDQUFDLElBQUk7d0JBQ2Qsb0RBQW9EO3dCQUNwRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDdkMsT0FBTyxHQUFHLFFBQVEsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO3dCQUN2QyxNQUFNO29CQUNOO3dCQUNJLG9EQUFvRDt3QkFDcEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDaEQsTUFBSztpQkFDWjthQUNKO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxFQUNELFNBQVMsQ0FDWixDQUFDO1FBQ0YsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQzlCLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUN6QztRQUNELE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9HLENBQUM7SUFFTSxjQUFjLENBQUMsS0FBaUIsRUFBRSxVQUFzQjtRQUMzRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsRixJQUNJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxLQUFLLElBQUksVUFBVSxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDbkUsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxFQUMzRDtZQUNFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JGLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDdkIsVUFBVSxJQUFJLE9BQU8sQ0FBQzthQUN6QjtTQUNKO1FBQ0QsT0FBTyxVQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQVcsSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELElBQVcsU0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELElBQVcsU0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDWCxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLFVBQVUsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDeEYsTUFBTSxJQUFJLEdBQUcsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDM0YsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcsV0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEs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