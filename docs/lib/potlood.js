import { Renderer } from "./painting/renderer.js";
import { Package } from "./package/package.js";
import { NamedStyles } from "./text/named-styles.js";
import { DocumentX } from "./document-x.js";
import { AbstractNumberings } from "./numbering/abstract-numberings.js";
import { Relationships } from "./package/relationships.js";
import { Metrics } from "./utils/metrics.js";
export class Potlood {
    constructor(element) {
        this.renderer = new Renderer(element);
    }
    loadDocxFromUrl(url) {
        Metrics.init();
        this.renderer.clear();
        Package.loadFromUrl(url).then((pack) => {
            this._loadFromPackage(pack);
        }).catch((err) => {
            console.log(`Failed to load ${url}: ${err}`);
        });
    }
    loadDocxFromFiles(files) {
        Metrics.init();
        this.renderer.clear();
        Package.loadFromFile(files).then((pack) => {
            this._loadFromPackage(pack);
        });
    }
    _loadFromPackage(pack) {
        pack.loadPartAsXml('word/_rels/document.xml.rels').then(relPart => {
            const relationships = Relationships.fromDocument(relPart.document);
            pack.loadPartAsXml('word/styles.xml').then(stylePart => {
                const styles = new NamedStyles(stylePart);
                styles.parseContent();
                if (pack.hasPart('word/numbering.xml')) {
                    pack.loadPartAsXml('word/numbering.xml').then(numPart => {
                        const numberings = new AbstractNumberings(numPart);
                        numberings.parseContent(styles);
                        this._loadDocument(pack, relationships, styles, numberings);
                    });
                }
                else {
                    this._loadDocument(pack, relationships, styles, undefined);
                }
            });
        });
    }
    _loadDocument(pack, relationships, styles, numberings) {
        pack.loadPartAsXml('word/document.xml').then(part => {
            const docx = new DocumentX(pack, part);
            docx.setRelationships(relationships);
            docx.setNamedStyles(styles);
            if (numberings !== undefined) {
                docx.setNumberings(numberings);
            }
            docx.parseContent();
            const posY = this.renderer.renderDocument(docx);
            this.renderer.ensureHeight(posY);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG90bG9vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3Rsb29kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTdDLE1BQU0sT0FBTyxPQUFPO0lBR2hCLFlBQVksT0FBb0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sZUFBZSxDQUFDLEdBQVc7UUFDOUIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEtBQWU7UUFDcEMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxJQUFhO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDOUQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7b0JBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3BELE1BQU0sVUFBVSxHQUFHLElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ25ELFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQ2hFLENBQUMsQ0FBQyxDQUFDO2lCQUNOO3FCQUFNO29CQUNILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQzlEO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxhQUFhLENBQ2pCLElBQWEsRUFDYixhQUE0QixFQUM1QixNQUFtQixFQUNuQixVQUEwQztRQUUxQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbEM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oifQ==