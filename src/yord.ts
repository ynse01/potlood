import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { WordStyles } from "./word-styles.js";
import { WordDocument } from "./word-document.js";

export class Yord {
    private renderer: SvgRenderer;
    private texts: string[] = [];
    private fontFamily: string = "Arial";
    private fontSize: number = 12;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
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
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.renderer.clear();
        this.writeAllText();           
    }

    private writeAllText() {
        var x = 20;
        var posY = 20;
        this.texts.forEach((text) => {
            posY = this.renderer.flowText(text, this.fontFamily, this.fontSize, x, posY);
        });
    }    
}