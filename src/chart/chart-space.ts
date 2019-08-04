import { Xml } from "../utils/xml.js";
import { BarChart } from "./bar-chart.js";

export class ChartSpace {
    public barChart: BarChart | undefined = undefined;

    public static fromNode(chartSpaceNode: Node): ChartSpace {
        const space = new ChartSpace();
        const chartNode = Xml.getFirstChildOfName(chartSpaceNode, "c:chart");
        if (chartNode !== undefined) {
            const plotAreaNode = Xml.getFirstChildOfName(chartNode, "c:plotArea");
            if (plotAreaNode !== undefined) {
                const barChartNode = Xml.getFirstChildOfName(plotAreaNode, "c:barChart");
                if (barChartNode !== undefined) {
                    space.barChart = BarChart.fromNode(barChartNode);
                }
            }
        }
        return space;
    }
}