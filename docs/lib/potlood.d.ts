export declare class Potlood {
    private renderer;
    constructor(element: HTMLElement);
    loadDocxFromUrl(url: string): void;
    loadDocxFromFiles(files: FileList): void;
    private _loadFromPackage;
    private _loadDocument;
}
