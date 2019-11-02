import { ChartRenderer } from "../chart/chart-renderer.js";
export class DrawingRenderer {
    constructor(painter) {
        this._painter = painter;
        this._chartRenderer = new ChartRenderer(this._painter);
    }
    renderDrawing(drawing, flow) {
        const x = flow.getX();
        const y = flow.getY();
        const width = drawing.bounds.boundSizeX;
        const height = drawing.bounds.boundSizeY;
        const picture = drawing.picture;
        if (picture !== undefined) {
            this._painter.paintPicture(x, y, width, height, picture);
        }
        const chart = drawing.chart;
        if (chart !== undefined) {
            const chartFlow = flow.clone();
            chart.ensureLoaded().then(() => {
                if (chart.barChart !== undefined) {
                    this._chartRenderer.renderBarChart(chart.barChart, chartFlow, width, height);
                }
            });
        }
        flow.advancePosition(drawing.getHeight(flow.getWidth()));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL2RyYXdpbmctcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTNELE1BQU0sT0FBTyxlQUFlO0lBSXhCLFlBQVksT0FBaUI7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLGFBQWEsQ0FBQyxPQUFtQixFQUFFLElBQWlCO1FBQ3ZELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM1QixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9CLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUMvQixJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO29CQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2hGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FFSiJ9