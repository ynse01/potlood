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