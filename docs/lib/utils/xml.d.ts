export declare class Xml {
    /**
     * Get the value of the attribute.
     * @param node Node to get the attribute from.
     * @param name Name of the attribute to get from the node.
     */
    static getAttribute(node: Node, name: string): string | undefined;
    /**
     * Get first of the direct child nodes which have nodeName equal to name.
     * @param parent The node under which to search for nodes.
     * @param name  The node name to search for.
     */
    static getFirstChildOfName(parent: Node, name: string): ChildNode | undefined;
    /**
     * Get the "w:val" attribute as string, from the child node with the specified name.
     */
    static getStringValueFromNode(parent: ChildNode, name: string): string | undefined;
    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    static getBooleanValueFromNode(parent: ChildNode, name: string): boolean | undefined;
    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    static getNumberValueFromNode(parent: ChildNode, name: string): number | undefined;
    /**
     * Interprets the attribute value as boolean.
     */
    static attributeAsBoolean(attr: string): boolean;
}
