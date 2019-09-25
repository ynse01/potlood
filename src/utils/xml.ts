export class Xml {

    /**
     * Get the value of the attribute.
     * @param node Node to get the attribute from.
     * @param name Name of the attribute to get from the node.
     */
    public static getAttribute(node: Node, name: string): string | undefined {
        let val: string | undefined = undefined;
        const element = node as Element;
        const attrVal = element.getAttribute(name);
        if (attrVal !== null) {
            val = attrVal;
        }
        return val;
    }

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
            const attr = Xml.getAttribute(child, "w:val");
            if (attr !== undefined) {
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
            const attr = Xml.getAttribute(child, "w:val");
            if (attr !== undefined) {
                val = Xml.attributeAsBoolean(attr);
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
        const child = Xml.getFirstChildOfName(parent, name);
        if (child !== undefined) {
            const attr = Xml.getAttribute(child, "w:val");
            if (attr !== undefined) {
                val = parseFloat(attr);
            }
        }
        return val;
    }

    /**
     * Interprets the attribute value as boolean.
     */
    public static attributeAsBoolean(attr: string): boolean {
        return (attr === 'true') || (attr === '1');
    }
}