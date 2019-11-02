import { NumberingLevel } from "./numbering-level.js";
export class Numbering {
    constructor() {
        this._levels = [];
    }
    /**
     * Parse a Numbering from a w:abstractNum Node.
     */
    static fromAbstractNumNode(styles, node) {
        const numbering = new Numbering();
        node.childNodes.forEach(levelNode => {
            if (levelNode.nodeName === "w:lvl") {
                const level = NumberingLevel.fromLevelNode(styles, levelNode);
                if (level !== undefined) {
                    numbering._levels[level.index] = level;
                }
            }
        });
        return numbering;
    }
    getLevel(index) {
        return this._levels[index];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL251bWJlcmluZy9udW1iZXJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE1BQU0sT0FBTyxTQUFTO0lBQXRCO1FBQ1ksWUFBTyxHQUFxQixFQUFFLENBQUM7SUFxQjNDLENBQUM7SUFuQkc7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBK0IsRUFBRSxJQUFlO1FBQzlFLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDaEMsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtnQkFDaEMsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzlELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDckIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUMxQzthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRU0sUUFBUSxDQUFDLEtBQWE7UUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDSiJ9