import { VirtualFlow } from "../utils/virtual-flow.js";
import { Xml } from "../utils/xml.js";

export enum TabLeader {
    None,
    Dot
}

export enum TabAlignment {
    Left,
    Right
}

export class TabStop {
    public position: number | undefined = undefined;
    public leader: TabLeader = TabLeader.None;
    private _pos: number;
    private _alignment: TabAlignment;

    public static fromTabsNode(tabsNode: Node): TabStop[] {
        const stops: TabStop[] = [];
        tabsNode.childNodes.forEach(tabNode => {
            const alignStr = Xml.getStringValue(tabNode);
            const leaderAttr = Xml.getAttribute(tabNode, "w:leader");
            const posAttr = Xml.getAttribute(tabNode, "w:pos");
            if (alignStr !== undefined && posAttr !== undefined) {
                const alignment = this._readTabAlignment(alignStr);
                const leader = this._readTabLeader(leaderAttr);
                const stop = new TabStop(parseInt(posAttr), alignment, leader);
                stops.push(stop);
            }
        });
        return stops;
    }

    private static _readTabAlignment(align: string): TabAlignment {
        let alignment = TabAlignment.Left;
        switch (align.toLowerCase()) {
            case "right":
                alignment = TabAlignment.Right;
                break;
            default:
                break;
        }
        return alignment;
    }

    private static _readTabLeader(leaderAttr: string | undefined): TabLeader {
        let leader = TabLeader.None;
        if (leaderAttr !== undefined) {
            switch (leaderAttr.toLowerCase()) {
                case "dot":
                    leader = TabLeader.Dot;
                    break;
                default:
                    break;
            }
        }
        return leader;
    }

    constructor(pos: number, align: TabAlignment, leader: TabLeader) {
        this._pos = pos;
        this._alignment = align;
        this.leader = leader;
    }

    public performLayout(flow: VirtualFlow) {
        if (this._alignment === TabAlignment.Left) {
            this.position = flow.getX() + this._pos;
        } else {
            this.position = flow.getX() + flow.getWidth() - this._pos;
        }
    }
}