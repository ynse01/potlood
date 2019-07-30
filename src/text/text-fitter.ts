import { Style } from "./style.js";
import { Metrics } from "../utils/metrics.js";

export class TextFitter {

    public static fitText(
        text: string,
        style: Style,
        width: number
    ): string {
        let subText = text;
        const identation = style.identation;
        while (Metrics.getTextWidth(subText, style) + identation > width) {
            const stripped = this._stripLastWord(subText);
            if (stripped === undefined) {
                break;
            }
            subText = stripped;
        }
        return subText;
    }

    private static _stripLastWord(text: string): string | undefined {
        const stop = text.lastIndexOf(' ');
        if (stop < 0) {
            return undefined;
        }
        if (stop === 0) {
            return this._stripLastWord(text.substring(1));
        }
        return text.substring(0, stop);
    }
}