import { Xml } from "./xml.js";
import { RunStyle } from "./run-style.js";
import { ParStyle } from "./par-style.js";
import { Style } from "./style.js";
import { NamedStyles } from "./named-styles.js";
import { Metrics } from "./metrics.js";

export enum LineInRun {
    Normal = 0,
    FirstLine = 1,
    LastLine = 2,
    OnlyLine = 3
}

export class Run {
    public text: string;
    public style: Style;

    public static fromRunNode(rNode: ChildNode, parStyle: ParStyle | undefined, namedStyles: NamedStyles | undefined): Run {
        const run = new Run("", new Style());
        const presentationNode = Xml.getFirstChildOfName(rNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        const textNode = Xml.getFirstChildOfName(rNode, "w:t");
        if (textNode !== undefined) {
            const text = textNode.textContent;
            if (text !== null) {
                run.text = text;
            }
        }
        run.style.applyNamedStyles(namedStyles);
        return run;
    }

    constructor(text: string, style: Style) {
        this.style = style;
        this.text = text;
    }

    public getTextHeight(width: number): number {
        return this.getNumberOfLines(width) * Metrics.getLineSpacing(this.style);
    }

    public getNumberOfLines(width: number): number {
        let remainder = this.text;
        let counter = 0;
        while(remainder.length > 0) {
            const line = this.fitText(remainder, this.style, width);
            remainder = remainder.substring(line.length);
            counter++;
        }
        return counter;
    }

    private stripLastWord(text: string): string {
        const stop = text.lastIndexOf(' ');
        return text.substring(0, stop);
    }
    
    private fitText(
        text: string,
        style: Style,
        width: number
    ): string {
        let subText = text;
        while (Metrics.getTextWidth(subText, style) + style.identation > width) {
            subText = this.stripLastWord(subText);
        }
        return subText;
    }    
}