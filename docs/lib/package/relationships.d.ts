export declare class Relationships {
    private relations;
    static fromDocument(doc: XMLDocument): Relationships;
    getTarget(id: string): string;
}
