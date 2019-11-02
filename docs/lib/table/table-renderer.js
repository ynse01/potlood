export class TableRenderer {
    constructor(painter, paragraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }
    renderTable(table, flow) {
        table.rows.forEach(row => {
            const height = row.getMaxHeight();
            row.cells.forEach(cell => {
                const cellFlow = flow.createCellFlow(cell, table);
                this.renderCellShading(cell, cellFlow, height);
                this.renderCellBorder(cell, table.style, cellFlow, height);
                cellFlow.advancePosition(table.style.margins.cellMarginTop);
                cell.pars.forEach(par => {
                    this._parRenderer.renderParagraph(par, cellFlow);
                });
            });
            flow.advancePosition(height);
        });
    }
    renderCellShading(cell, flow, height) {
        if (cell.style.shading !== "") {
            let x = flow.getX();
            let y = flow.getY();
            let width = cell.getWidth();
            this._painter.paintLine(x, y, x + width, y, cell.style.shading, height);
        }
    }
    renderCellBorder(cell, style, flow, height) {
        let outerBorders = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let x = flow.getX();
        let y = flow.getY();
        let cellWidth = cell.getWidth();
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, outerBorders.borderTop.color, outerBorders.borderTop.size);
            }
            if (outerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, outerBorders.borderBottom.color, outerBorders.borderBottom.size);
            }
            if (outerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, outerBorders.borderStart.color, outerBorders.borderStart.size);
            }
            if (outerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, outerBorders.borderEnd.color, outerBorders.borderEnd.size);
            }
        }
        if (innerBorders !== undefined) {
            const cellSpacing = style.cellSpacing;
            x += cellSpacing;
            y += cellSpacing;
            cellWidth -= 2 * cellSpacing;
            if (innerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, innerBorders.borderTop.color, innerBorders.borderTop.size);
            }
            if (innerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, innerBorders.borderBottom.color, innerBorders.borderBottom.size);
            }
            if (innerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, innerBorders.borderStart.color, innerBorders.borderStart.size);
            }
            if (innerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, innerBorders.borderEnd.color, innerBorders.borderEnd.size);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsTUFBTSxPQUFPLGFBQWE7SUFJdEIsWUFBWSxPQUFpQixFQUFFLGlCQUFvQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDO0lBQzFDLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBWSxFQUFFLElBQWlCO1FBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxJQUFlLEVBQUUsSUFBaUIsRUFBRSxNQUFjO1FBQ3hFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDM0U7SUFDTCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsSUFBZSxFQUFFLEtBQWlCLEVBQUUsSUFBaUIsRUFBRSxNQUFjO1FBQzFGLElBQUksWUFBWSxHQUErQixLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3hDLDJCQUEyQjtRQUMzQixJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDekQsK0NBQStDO1lBQy9DLFlBQVksR0FBRyxTQUFTLENBQUM7U0FDNUI7UUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlHO1lBQ0QsSUFBSSxZQUFZLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDekMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlIO1lBQ0QsSUFBSSxZQUFZLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9HO1lBQ0QsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9HO1NBQ0o7UUFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUN0QyxDQUFDLElBQUksV0FBVyxDQUFDO1lBQ2pCLENBQUMsSUFBSSxXQUFXLENBQUM7WUFDakIsU0FBUyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDN0IsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlHO1lBQ0QsSUFBSSxZQUFZLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDekMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlIO1lBQ0QsSUFBSSxZQUFZLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9HO1lBQ0QsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9HO1NBQ0o7SUFDTCxDQUFDO0NBRUoifQ==