import { ChartAxisCrossMode } from "./chart-axis.js";
export class ChartRenderer {
    constructor(painter) {
        this._painter = painter;
    }
    renderBarChart(barChart, flow, width, height) {
        const bounds = barChart.getValueBounds();
        const seriesSpacing = width / (bounds.numCats * bounds.numSeries);
        const catSpacing = width / bounds.numSeries;
        const flowX = flow.getX();
        const topY = flow.getY();
        const bottomY = topY + height;
        const range = barChart.getValueRange();
        const valueAxis = barChart.space.plotArea.valueAxis;
        if (valueAxis !== undefined && valueAxis.crossMode === ChartAxisCrossMode.AutoZero) {
            range.min = 0;
        }
        for (let i = 0; i < bounds.numCats; i++) {
            for (let j = 0; j < bounds.numValues; j++) {
                for (let k = 0; k < bounds.numSeries; k++) {
                    const val = barChart.getValue(i, k);
                    const normalizedValue = (val.numeric - range.min) / (range.max - range.min);
                    const color = barChart.getColor(k);
                    const x = flowX + i * catSpacing + k * seriesSpacing;
                    const y = bottomY - (bottomY - topY) * normalizedValue;
                    this._painter.paintLine(x, bottomY, x, y, color, seriesSpacing);
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFckQsTUFBTSxPQUFPLGFBQWE7SUFHdEIsWUFBWSxPQUFpQjtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRU0sY0FBYyxDQUFDLFFBQWtCLEVBQUUsSUFBaUIsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUN0RixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsTUFBTSxhQUFhLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEUsTUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDcEQsSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEtBQUssa0JBQWtCLENBQUMsUUFBUSxFQUFFO1lBQ2hGLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3RSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUNyRCxNQUFNLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsZUFBZSxDQUFDO29CQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lCQUNuRTthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBQ0oifQ==