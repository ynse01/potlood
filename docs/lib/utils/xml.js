export class Xml {
    /**
     * Get the value of the attribute.
     * @param node Node to get the attribute from.
     * @param name Name of the attribute to get from the node.
     */
    static getAttribute(node, name) {
        let val = undefined;
        const element = node;
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
    static getFirstChildOfName(parent, name) {
        let child = undefined;
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
    static getStringValueFromNode(parent, name) {
        let val = undefined;
        const child = Xml.getFirstChildOfName(parent, name);
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
    static getBooleanValueFromNode(parent, name) {
        let val = undefined;
        const child = Xml.getFirstChildOfName(parent, name);
        if (child !== undefined) {
            const attr = Xml.getAttribute(child, "w:val");
            if (attr !== undefined) {
                val = Xml.attributeAsBoolean(attr);
            }
            else {
                // Absence of w:val means true
                val = true;
            }
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    static getNumberValueFromNode(parent, name) {
        let val = undefined;
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
    static attributeAsBoolean(attr) {
        return (attr === 'true') || (attr === '1');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3htbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sR0FBRztJQUVaOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVUsRUFBRSxJQUFZO1FBQy9DLElBQUksR0FBRyxHQUF1QixTQUFTLENBQUM7UUFDeEMsTUFBTSxPQUFPLEdBQUcsSUFBZSxDQUFDO1FBQ2hDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ2xCLEdBQUcsR0FBRyxPQUFPLENBQUM7U0FDakI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQVksRUFBRSxJQUFZO1FBQ3hELElBQUksS0FBSyxHQUEwQixTQUFTLENBQUM7UUFDN0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUMvQixLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO2FBQ1Q7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFpQixFQUFFLElBQVk7UUFDaEUsSUFBSSxHQUFHLEdBQXVCLFNBQVMsQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBWSxDQUFDO1FBQy9ELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDZDtTQUNKO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsTUFBaUIsRUFBRSxJQUFZO1FBQ2pFLElBQUksR0FBRyxHQUF3QixTQUFTLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQVksQ0FBQztRQUMvRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUNwQixHQUFHLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNILDhCQUE4QjtnQkFDOUIsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNkO1NBQ0o7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFpQixFQUFFLElBQVk7UUFDaEUsSUFBSSxHQUFHLEdBQXVCLFNBQVMsQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUI7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQVk7UUFDekMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0oifQ==