import { IPainter, IRectangle, DashMode } from "./i-painter.js";
import { Justification } from "../paragraph/par-style.js";
import { Picture } from "../drawing/picture.js";
import { Xml } from "../utils/xml.js";

export class SvgPainter implements IPainter {
    private static readonly svgNS = 'http://www.w3.org/2000/svg';
    private _svg: Element;
    private _root: Element;
    private _lastText: SVGTextElement | undefined;

    constructor(content: HTMLElement) {
        const root = document.createElementNS(SvgPainter.svgNS, 'svg');
        const width = content.clientWidth.toString();
        root.setAttribute('id', 'svg');
        root.setAttribute('width', width);
        root.setAttribute('height', '500');
        root.setAttribute('style', 'white-space:pre');
        content.appendChild(root);
        this._svg = root;
        this._root = root;
    }

    public get svg(): Element {
        return this._svg;
    }

    public paintText(x: number, y: number, width: number, stretched: boolean, text: string, color: string, justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean) {
        const newText = document.createElementNS(SvgPainter.svgNS, 'text');
        this._setFont(newText, fontFamily, fontSize, bold, italic);
        this._setColor(newText, color);
        this._setHorizontalAlignment(newText, x, width, justification, stretched);
        this._setVerticalAlignment(newText, y, fontSize);
        const textNode = document.createTextNode(text);
        newText.appendChild(textNode);
        this._svg.appendChild(newText);
        this._lastText = newText;
    }
    
    public measureLastText(): IRectangle {
        let rect: IRectangle;
        if (this._lastText !== undefined) {
            const box = this._lastText.getBBox();
            rect = {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height
            };
        } else {
            rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        return rect;
    }

    public paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number, dashing: DashMode): void {
        const line = document.createElementNS(SvgPainter.svgNS, "line");
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", `#${color}`);
        line.setAttribute("stroke-width", thickness.toString());
        this._setDashing(line, dashing);
        this._svg.appendChild(line);
    }

    public paintPolygon(path: string, fillColor: string | undefined, strokeColor: string | undefined, strokeThickness: number | undefined, dashing: DashMode): void {
        const element = document.createElementNS(SvgPainter.svgNS, "path");
        element.setAttribute("d", path);
        if (fillColor !== undefined) {
            element.setAttribute("fill", `#${fillColor}`);
        }
        if (strokeColor !== undefined) {
            element.setAttribute("stroke", `#${strokeColor}`);
        }
        element.setAttribute("stroke-width", `${strokeThickness}`);
        this._setDashing(element, dashing);
        this._svg.appendChild(element);
    }

    public paintPicture(x: number, y: number, width: number, height: number, pic: Picture): void {
        if (pic !== undefined) {
            pic.getImageUrl().then(url => {
                if (url instanceof SVGElement) {
                    const g = document.createElementNS(SvgPainter.svgNS, "g");
                    url.setAttribute("x", `${x}`);
                    url.setAttribute("y", `${y}`);
                    url.setAttribute("width", `${width}`);
                    url.setAttribute("height", `${height}`);
                    this.svg.appendChild(g);
                    g.appendChild(url);
                } else {
                    const image = document.createElementNS(SvgPainter.svgNS, "image");
                    image.setAttribute("x", `${x}`);
                    image.setAttribute("y", `${y}`);
                    image.setAttribute("width", `${width}`);
                    image.setAttribute("height", `${height}`);
                    this.svg.appendChild(image);
                    image.setAttribute("xlink:href", `${url}`);
                    image.setAttribute("href", `${url}`);
                }
            }).catch(error => {
                console.log(`ERROR during rendering: ${error}`);
            })
        }      
    }

    public clear(): void {
        while (this.svg.lastChild) {
          this.svg.removeChild(this.svg.lastChild);
        }
    }

    public setWidth(newWidth: number): void {
        const width = Xml.getAttribute(this.svg, "width");
        if (width !== undefined) {
            this._svg.setAttribute("width", `${newWidth}`);
            const root = this._svg.parentElement;
            if (root !== null) {
                root.setAttribute("width", `${newWidth}`);
            }
        }
    }

    public ensureHeight(newHeight: number): void {
        const height = Xml.getAttribute(this.svg, "height");
        if (height !== undefined) {
            const heightNum = parseFloat(height);
            const maxY = Math.max(heightNum, newHeight);
            if (maxY > heightNum) {
                this._svg.setAttribute("height", `${maxY}`);
                const root = this._svg.parentElement;
                if (root !== null) {
                    root.setAttribute("height", `${maxY}`);
                }
            }
        }  
    }

    public startLink(url: string): void {
        const a = document.createElementNS(SvgPainter.svgNS, "a");
        a.setAttribute("href", url);
        this._svg = a;
        this._root.appendChild(this._svg);
    }

    public endLink(): void {
        if (this._svg !== this._root) {
            this._svg = this._root;
        }
    }

    private _setFont(textNode: Element, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void {
        textNode.setAttribute('font-family', fontFamily);
        textNode.setAttribute('font-size', fontSize.toString());
        if (bold) {
            textNode.setAttribute('font-weight', 'bold');
        }
        if (italic) {
            textNode.setAttribute('font-style', 'italic');
        }
    }
    
    private _setColor(textNode: Element, color: string) {
        textNode.setAttribute('fill', `#${color}`);
    }
    
    private _setDashing(node: Element, dashing: DashMode): void {
        switch(dashing) {
            case DashMode.Dashed:
                node.setAttribute("stroke-dasharray", "4");
                break;
            case DashMode.Dotted:
                node.setAttribute("stroke-dasharray", "1");
                break;
        }
    }

    private _setHorizontalAlignment(textNode: Element, x: number, width: number, justification: Justification, stretched: boolean): void {
        switch(justification) {
            case Justification.both:
                textNode.setAttribute('x', x.toString());
                if (stretched) {
                    textNode.setAttribute('textLength', width.toString());
                    textNode.setAttribute('lengthAdjust', 'spacing');
                }
                break;
            case Justification.right:
                const right = x + width;
                textNode.setAttribute('x', right.toString());
                textNode.setAttribute('text-anchor', "end");
                break;
            case Justification.center:
                const center = x + width / 2;
                textNode.setAttribute('x', center.toString());
                textNode.setAttribute('text-anchor', "middle");
                break;
            case Justification.left:
            default:
                textNode.setAttribute('x', x.toString());
                textNode.setAttribute('text-anchor', "start");
                break;
        }
    }
  
    private _setVerticalAlignment(textNode: Element, y: number, _fontSize: number): void {
        textNode.setAttribute('y', y.toString());
    }
}