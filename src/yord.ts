import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { WordStyles } from "./word-styles.js";
import { WordDocument } from "./word-document.js";
import { Style } from "./style.js";

export class Yord {
    private renderer: SvgRenderer;
    private texts: string[] = [];
    private style: Style;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
        this.style = new Style();
    }

    public loadDocxFromUrl(url: string) {
        Package.loadFromUrl(url).then((pack) => {
            pack.loadPart('word/styles.xml').then(stylePart => {
                const styles = new WordStyles(stylePart);
                styles.parseContent();
                pack.loadPart('word/document.xml').then(part => {
                    const doc = new WordDocument(part);
                    doc.parseContent();
                    doc.paragraphs.forEach(par => {
                        this.texts.push(...par.texts);
                    });
                    this.writeAllText();
                });
            });
        });
    }

    public updateFont(fontFamily: string, fontSize: number): void {
        this.style.updateFont(fontFamily, fontSize);
        this.renderer.clear();
        this.writeAllText();           
    }

    private writeAllText() {
        var posY = 20;
        this.texts.forEach((text) => {
            posY = this.renderer.flowText(text, this.style, posY);
        });
        this.renderer.ensureHeight(posY);
    }    
}