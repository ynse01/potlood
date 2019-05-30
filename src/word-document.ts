import { Part } from "./part";

export class WordDocument {
    private part: Part;
    private pars: string[] = [];

    constructor(part: Part) {
        this.part = part;
    }

    public parseContent(): void {
        const body = this.part.document.childNodes[0].childNodes[1];
        body.childNodes.forEach(element => {
            switch(element.nodeName) {
                case "p":
                case "w:p":
                    const text = element.textContent;
                    if (text !== null) {
                        this.pars.push(text);
                    }
                    break;
                default:
                    console.log("Don't know how to parse " + element.nodeName);
                    break;
            }
        });
    }

    public get paragraphs(): string[] {
        return this.pars;
    }
}