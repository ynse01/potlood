import { ChartSeries } from "./chart-series.js";

export class BarChart {
    public series: ChartSeries[] = [];

    public static fromNode(barChartNode: Node): BarChart {
        const chart = new BarChart();
        barChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = ChartSeries.fromNode(child);
                chart.series.push(series);
            }
        });
        return chart;
    }
}