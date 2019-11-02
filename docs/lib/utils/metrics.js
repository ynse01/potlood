export class Metrics {
    /**
     * Convert twentieths of a point in DocX coordinates to SVG pixels.
     * @param twips Twentieths of a point.
     */
    static convertTwipsToPixels(twips) {
        // Normal screen is 28 dots per inch
        // 20 twips = 1 point
        // 72 points = 1 inch
        // 1440 twips = 1 inch
        // (567 twips = 1 cm)
        // (1 point = 1.333333 px)
        return twips / 15;
    }
    /**
     * Convert a number of point in DocX coordinates to SVG pixels.
     * @param points DocX point.
     */
    static convertPointToPixels(points) {
        return Metrics.convertTwipsToPixels(points * 20);
    }
    /**
     * Convert EMU's (used in DrawingML) to SVG pixels.
     * @param emu EMU's to convert into pixels.
     */
    static convertEmuToPixels(emu) {
        // 1 inch = 914400 EMU
        // 1 inch = 72 points
        // 1 point = 1270 EMU
        return Metrics.convertPointToPixels(emu / 12700);
    }
    /**
     * Convert a number of point in Word coordinates to SVG font size
     * @param points Word point.
     */
    static convertPointToFontSize(points) {
        return points * 46 / 72;
    }
    /**
     * Convert rotation to radians.
     * @param rot Rotation in 60000th of a degree.
     */
    static convertRotationToRadians(rot) {
        return (rot * Math.PI) / (180 * 60000);
    }
    static getTextWidth(text, style) {
        return this.getTextWidthFromCanvas(text, style);
    }
    static getTextWidthFromSvg(text, style) {
        var element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        element.setAttribute('font-family', style.fontFamily);
        element.setAttribute('font-size', `${style.fontSize}`);
        if (style.bold) {
            element.setAttribute('font-weight', 'bold');
        }
        if (style.italic) {
            element.setAttribute('font-style', 'italic');
        }
        const node = document.createTextNode(text);
        element.appendChild(node);
        this.svg.appendChild(element);
        const width = element.getComputedTextLength();
        // const width = element.getBBox().width;
        // const width = element.getBoundingClientRect().width;
        this.svg.removeChild(element);
        return width;
    }
    static getTextWidthFromCanvas(text, style) {
        const metrics = this.getTextMetrics(text, style);
        return metrics.width;
    }
    static getTextMetrics(text, style) {
        const italicText = (style.italic) ? "italic " : "";
        const boldText = (style.bold) ? "bold " : "";
        this.context.font = italicText + boldText + Math.round(style.fontSize) + 'px ' + style.fontFamily;
        const metrics = this.context.measureText(text);
        return metrics;
    }
    static init() {
        if (this.canvas === undefined) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.svg.setAttribute('width', '2048');
            this.svg.setAttribute('height', '240');
            this.svg.setAttribute('visibility', 'hidden');
            document.body.appendChild(this.svg);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9tZXRyaWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxPQUFPO0lBRWxCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFhO1FBQzlDLG9DQUFvQztRQUNwQyxxQkFBcUI7UUFDckIscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QixxQkFBcUI7UUFDckIsMEJBQTBCO1FBQzFCLE9BQU8sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQWM7UUFDL0MsT0FBTyxPQUFPLENBQUMsb0JBQW9CLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBVztRQUMxQyxzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLHFCQUFxQjtRQUNyQixPQUFPLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFjO1FBQ2pELE9BQU8sTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxHQUFXO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxLQUFZO1FBQ25ELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQVksRUFBRSxLQUFZO1FBQzFELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDN0M7UUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDOUMseUNBQXlDO1FBQ3pDLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxNQUFNLENBQUMsc0JBQXNCLENBQ2xDLElBQVksRUFDWixLQUFZO1FBRVosTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakQsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQVksRUFBRSxLQUFZO1FBQ3JELE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNsRyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQUk7UUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztDQUtGIn0=