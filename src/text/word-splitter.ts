
export enum WordSeperator {
    Space,
    Dash,
    Tab
}

export class WordSplitter {
    public words: string[];
    
    constructor(txt: string){
        this.words = txt.split(/[\s-]/);
    }
}