import { Metrics } from './metrics.js';
import { Style } from '../text/style.js';
export class Fonts {
    /**
     * List of available fonts on this device.
     */
    static availableFonts() {
        if (!Fonts._initialized) {
            Fonts._initialized = true;
            const families = [
                'Arial',
                'Helvetica',
                'Times',
                'Courier',
                'Verdana',
                'Georgia',
                'Garamond',
                'Comic Sans MS',
                'Trebuchet MS',
                'Arial Black',
                'Impact'
            ];
            const style = new Style();
            style.runStyle.updateFont('Times New Roman', false, Fonts.testSize);
            Fonts.baseline = Metrics.getTextWidth(Fonts.testString, style) / Fonts.testString.length;
            Fonts._foundFonts['Times New Roman'] = Fonts.baseline;
            families.forEach(family => {
                Fonts.testFont(family, false);
            });
        }
        return Fonts._foundFonts;
    }
    static tryAddFonts(families) {
        for (let i = 0; i < families.length; i++) {
            if (this.tryAddFont(families[i], false)) {
                return i;
            }
        }
        return -1;
    }
    static tryAddFont(family, bold) {
        const name = Fonts._getName(family, bold);
        const isAvailable = Fonts.availableFonts()[name] !== undefined;
        if (!isAvailable) {
            const isNotAvailable = Fonts._notFoundFonts[name] !== undefined;
            if (!isNotAvailable) {
                return Fonts.testFont(family, bold);
            }
            return false;
        }
        return true;
    }
    static testFont(family, bold) {
        const style = new Style();
        style.runStyle.updateFont(family, bold, Fonts.testSize);
        const name = Fonts._getName(family, bold);
        const widthOfString = Metrics.getTextWidth(Fonts.testString, style);
        const widthOfChar = widthOfString / Fonts.testString.length;
        if (widthOfChar !== Fonts.baseline) {
            Fonts._foundFonts[name] = widthOfChar;
            return true;
        }
        else {
            Fonts._notFoundFonts[name] = widthOfChar;
            return false;
        }
    }
    static _getName(family, bold) {
        return family + ((bold) ? "-bold" : "");
    }
}
Fonts._initialized = false;
Fonts._foundFonts = {};
Fonts._notFoundFonts = {};
Fonts.testString = 'mmmmmllnnrr';
Fonts.testSize = 72;
Fonts.baseline = undefined;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFekMsTUFBTSxPQUFPLEtBQUs7SUFRaEI7O09BRUc7SUFDSSxNQUFNLENBQUMsY0FBYztRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUN2QixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUMxQixNQUFNLFFBQVEsR0FBRztnQkFDZixPQUFPO2dCQUNQLFdBQVc7Z0JBQ1gsT0FBTztnQkFDUCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxVQUFVO2dCQUNWLGVBQWU7Z0JBQ2YsY0FBYztnQkFDZCxhQUFhO2dCQUNiLFFBQVE7YUFDVCxDQUFDO1lBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ3pGLEtBQUssQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQ3RELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3hCLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLEtB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