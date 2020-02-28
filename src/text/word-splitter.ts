
export enum WordSeperator {
    Space,
    Dash,
    Tab
}

export class WordSplitter {
    private _txt: string;
    private _words: string[] | undefined;

    constructor(txt: string){
        this._txt = txt;
    }

    public get words(): string[] {
        if (this._words === undefined) {
            this._split();
        }
        return this._words || [];
    }

    private _split(): void {
        this._words = this._txt.split(/[\s-]/);
    }
}