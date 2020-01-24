
export class CoreProperties {
    public creator: string | undefined = undefined;
    public created: Date | undefined = undefined;
    public description: string | undefined = undefined;
    public language: string | undefined = undefined;
    public lastModifiedBy: string | undefined = undefined;
    public lastModified: Date | undefined = undefined;
    public lastPrinted: Date | undefined = undefined;
    public revision: number | undefined = undefined;
    public subject: string | undefined = undefined;
    public title: string | undefined = undefined;
    public keywords: string | undefined = undefined;

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
                        coreProperties.lastModified = CoreProperties._parseDateString(text);
                        break;
                    case "cp:lastPrinted":
                        coreProperties.lastPrinted = CoreProperties._parseDateString(text);
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
                    case "cp:keywords":
                        coreProperties.keywords = text;
                        break;
                    default:
                        console.log(`Unknown core property ${propNode.nodeName} encountered during reading.`);
                        break;
                }
            });
        });
        return coreProperties;
    }

    private static _parseDateString(text: string): Date | undefined {
        // Expecting formats: 
        // YYYY
        // YYYY-MM
        // YYYY-MM-DD
        // YYYY-MM-DDThh:mmZ
        // YYYY-MM-DDThh:mm:ssZ
        // YYYY-MM-DDThh:mm:ss.sZ
        // Where T is literal and Z can be literal Z or a time zone offset (+hh:mm or -hh:mm).
        const year = parseInt(text.substr(0, 4));
        const month = (text.length <= 4) ? 0 : parseInt(text.substr(5, 2));
        const day = (text.length <= 7) ? 0 : parseInt(text.substr(8, 2));
        let hour = 0;
        let min = 0;
        let sec = 0;
        const milli = 0;
        if (text.length > 10) {
            hour = parseInt(text.substr(11, 2));
            min = parseInt(text.substr(14, 2));
            sec = parseInt(text.substr(17, 2));
        }
        return new Date(Date.UTC(year, month - 1, day, hour, min, sec, milli));
    }
}