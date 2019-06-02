export class Xml {
    /**
     * Get first of the direct child nodes which have nodeName equal to name.
     * @param parent The node under which to search for nodes.
     * @param name  The node name to search for.
     */
    public static getFirstChildOfName(parent: Node, name: string): ChildNode | undefined {
        let child: ChildNode | undefined = undefined;
        const children = parent.childNodes;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName === name) {
                child = children[i];
                break;
            }
        }
        return child;
    }

    /**
     * Get the "w:val" attribute as string, from the child node with the specified name.
     */
    public static getStringValueFromNode(parent: ChildNode, name: string): string | undefined {
        let val: string | undefined = undefined;
        const child = Xml.getFirstChildOfName(parent, name) as Element;
        if (child !== undefined) {
            const attr = child.getAttribute("w:val");
            if (attr !== null) {
                val = attr;
            }
        }
        return val;
    }

    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    public static getBooleanValueFromNode(parent: ChildNode, name: string): boolean | undefined {
        let val: boolean | undefined = undefined;
        const child = Xml.getFirstChildOfName(parent, name) as Element;
        if (child !== undefined) {
            const attr = child.getAttribute("w:val");
            if (attr !== null) {
                val = (attr === 'true');
            } else {
                // Absence of w:val means true
                val = true;
            }
        }
        return val;
    }

    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    public static getNumberValueFromNode(parent: ChildNode, name: string): number | undefined {
        let val: number | undefined = undefined;
        const child = Xml.getFirstChildOfName(parent, name) as Element;
        if (child !== undefined) {
            const attr = child.getAttribute("w:val");
            if (attr !== null) {
                val = parseFloat(attr);
            }
        }
        return val;
    }

    /**
     * Get child nodes which have nodeName equal to name. Works on full depth of tree.
     * @param parent The node under which to search for nodes.
     * @param name  The node name to search for.
     */
    public static getChildrenOfName(parent: ChildNode, name: string): ChildNode[] {
        const nodes: ChildNode[] = [];
        parent.childNodes.forEach(child => {
            if (child.nodeName === name) {
                nodes.push(child);
            }
            nodes.push(...Xml.getChildrenOfName(child, name));
        });
        return nodes;
    } 
}