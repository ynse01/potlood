import { VirtualFlow } from "../utils/virtual-flow.js";
import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Justification } from "./par-style.js";

export enum TabLeader {
    None,
    Dot
}

export enum TabAlignment {
    Clear,
    Left,
    Right,
    Center,
    Numbering
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
                const pos = Metrics.convertTwipsToPixels(parseInt(posAttr));
                const stop = new TabStop(pos, alignment, leader);
                stops.push(stop);
            }
        });
        return stops;
    }

    private static _readTabAlignment(align: string): TabAlignment {
        let alignment = TabAlignment.Left;
        switch (align.toLowerCase()) {
            case "num":
                alignment = TabAlignment.Numbering;
                break;
            case "center":
                alignment = TabAlignment.Center;
                break;
            case "clear":
                alignment = TabAlignment.Clear;
                break;
            case "left":
                alignment = TabAlignment.Left;
                break;
            case "right":
                alignment = TabAlignment.Right;
                break;
            default:
                console.log(`Unknown tab alignment value encountered: ${align}`);
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

    public get isClear(): boolean {
        return this._alignment === TabAlignment.Clear;
    }

    public get justification(): Justification {
        let justification = Justification.left;
        if (this._alignment === TabAlignment.Center) {
            justification = Justification.center;
        } else if (this._alignment === TabAlignment.Right) {
            justification = Justification.right;
        }
        return justification;
    }

    public performLayout(flow: VirtualFlow) {
        if (this._alignment !== TabAlignment.Clear) {
            this.position = flow.getX() + this._pos;
        }
    }
}