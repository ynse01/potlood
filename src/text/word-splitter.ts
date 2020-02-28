
export enum WordSeperator {
    Space,
    Dash,
    Tab,
    LineFeed
}

export class WordSplitter {
    private _txt: string;
    private _words: string[] | undefined;
    private _seperators: WordSeperator[] | undefined;

    constructor(txt: string){
        this._txt = txt;
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

    private _split(): void {
        this._words = this._txt.split(/[\s-\t]/);
        const seperators: WordSeperator[] = [];
        let index = 0;
        for (let i = 1; i < this._words.length; i++) {
            index += this._words[i - 1].length;
            const currentChar = this._txt.charAt(index);
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