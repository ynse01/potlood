
export class CoreProperties {
    public creator: string | undefined = undefined;
    public created: Date | undefined = undefined;
    public description: string | undefined = undefined;
    public language: string | undefined = undefined;
    public lastModifiedBy: string | undefined = undefined;
    public modified: Date | undefined = undefined;
    public revision: number | undefined = undefined;
    public subject: string | undefined = undefined;
    public title: string | undefined = undefined;

    public static fromDocument(doc: XMLDocument): CoreProperties {
        const coreProperties = new CoreProperties();
        doc.getRootNode().childNodes.forEach(propsNode => {
            propsNode.childNodes.forEach(propNode => {
                const text = (propNode.textContent === null) ? "" : propNode.textContent;
                switch (propNode.nodeName) {
                    case "dcterms:created":
                        coreProperties.created = CoreProperties._parseDateString(text);
                        break;
                    case "dc:creator":
                        coreProperties.creator = text;
                        break;
                    case "dc:description":
                        coreProperties.description = text;
                        break;
                    case "dc:language":
                        coreProperties.language = text;
                        break;
                    case "cp:lastModifiedBy":
                        coreProperties.lastModifiedBy = text;
                        break;
                    case "dcterms:modified":
                        coreProperties.modified = CoreProperties._parseDateString(text);
                        break;
                    case "cp:revision":
                        coreProperties.revision = parseInt(text);
                        break;
                    case "dc:subject":
                        coreProperties.subject = text;
                        break;
                    case "dc:title":
                        coreProperties.title = text;
                        break;
                    default:
                        console.log(`Unknown core property encountered during reading.`);
                        break;
                }
            });
        });
        return coreProperties;
    }

    private static _parseDateString(_text: string): Date | undefined {
        return undefined;
    }
}