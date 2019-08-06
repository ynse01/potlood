import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";

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

    public getValueBounds(): {numCats: number, numValues: number, numSeries: number} {
        return {
            numCats: this.series[0].categories.length,
            numValues: this.series[0].values.length,
            numSeries: this.series.length
        };
    }

    public getValue(catIndex: number, seriesIndex: number): ChartValue {
        return this.series[seriesIndex].values[catIndex];
    }

    public getValueRange(): { max: number, min: number } {
        return { max: 10, min: 0};
    }

    public getColor(seriesIndex: number): string {
        return this.series[seriesIndex].color;
    }
}