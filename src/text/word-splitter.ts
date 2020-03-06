
export enum WordSeperator {
    Space,
    Dash,
    Tab,
    LineFeed
}

export class WordSplitter {
    private _texts: string[];
    private _words: string[] | undefined;
    private _seperators: WordSeperator[] | undefined;

    constructor(texts: string[]){
        this._texts = texts;
    }

    public get words(): string[] {
        if (this._words === undefined) {
            this._split();
        }
        return this._words || [];
    }

    public getSeperator(index: number): WordSeperator {
        if (this._words === undefined) {
            this._split();
        }
        return this._seperators![index];
    }

    /**
     * Combine the words from start to end index, inclusive.
     */
    public combine(start: number, end: number): string {
        const results: string[] = [];
        if (this._words === undefined) {
            this._split();
        }
        const words = this._words!;
        for (let i = start; i <= end; i++) {
            results.push(words![i]);
            const sep = this.getSeperator(i);
            switch(sep) {
                case WordSeperator.Dash:
                    results.push("-");
                    break;
                case WordSeperator.Tab:
                    // Push nothing
                    break;
                default:
                    results.push(" ");
                    break;
            }
        }
        return results.join("");
    }

    private _split(): void {
        const txt = this._texts.join('');
        this._words = txt.split(/[\s-\t]/);
        const seperators: WordSeperator[] = [];
        let index = 0;
        for (let i = 1; i < this._words.length; i++) {
            index += this._words[i - 1].length;
            const currentChar = txt.charAt(index);
            switch(currentChar) {
                case " ":
                    seperators.push(WordSeperator.Space);
                    break;
                case "-":
                    seperators.push(WordSeperator.Dash);
                    break;
                case "\t":
                    seperators.push(WordSeperator.Tab);
                    break;
                case "\r":
                case "\n":
                    seperators.push(WordSeperator.LineFeed);
                    break;
                default:
                    console.log("Invalid seperator character found, assuming a space.");
                    seperators.push(WordSeperator.Space);
                    break;
            }
            index++;
        }
        this._seperators = seperators;
    }
}