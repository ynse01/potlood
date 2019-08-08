import { BarChart } from "../chart/bar-chart";
import { VirtualFlow } from "../virtual-flow";
import { DrawingRun } from "./drawing-run";
import { IPainter } from "../painting/i-painter";

export class DrawingRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderDrawing(drawing: DrawingRun, flow: VirtualFlow) {
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
              this.renderBarChart(chart.barChart, chartFlow, width, height);
            }
          });
        }
        flow.advancePosition(drawing.getHeight(flow.getWidth()));
      }
    
    private renderBarChart(barChart: BarChart, flow: VirtualFlow, width: number, height: number): void {
        const bounds = barChart.getValueBounds();
        const seriesSpacing = width / (bounds.numCats * bounds.numSeries);
        const catSpacing = width / bounds.numSeries;
        const flowX = flow.getX();
        const topY = flow.getY();
        const bottomY = topY + height;
        const range = barChart.getValueRange();
        for(let i = 0; i < bounds.numCats; i++) {
            for(let j = 0; j < bounds.numValues; j++) {
                for(let k = 0; k < bounds.numSeries; k++) {
                    const val = barChart.getValue(i, k);
                    const normalizedValue = (val.numeric! - range.min) / (range.max - range.min);
                    const color = barChart.getColor(k);
                    const x = flowX + i * catSpacing + k * seriesSpacing;
                    const y = bottomY - (bottomY - topY) * normalizedValue;
                    this._painter.paintLine(x, bottomY, x, y, color, seriesSpacing);
                }
            }
        }
    }
    
}