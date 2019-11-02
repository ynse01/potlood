var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
export class ChartSpace {
    constructor() {
        this._promise = undefined;
        this._barChart = undefined;
        this.style = new ChartStyle();
        this.plotArea = new ChartPlotArea();
        this.legend = undefined;
    }
    ensureLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._promise !== undefined) {
                yield this._promise;
                this._promise = undefined;
            }
        });
    }
    get barChart() {
        return this._barChart;
    }
    setBarChart(barChart) {
        this._barChart = barChart;
    }
    setPromise(promise) {
        this.ensureLoaded();
        this._promise = promise;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtc3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUdyRCxNQUFNLE9BQU8sVUFBVTtJQUF2QjtRQUNZLGFBQVEsR0FBOEIsU0FBUyxDQUFDO1FBQ2hELGNBQVMsR0FBeUIsU0FBUyxDQUFDO1FBQzdDLFVBQUssR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLGFBQVEsR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUM5QyxXQUFNLEdBQTRCLFNBQVMsQ0FBQztJQXFCdkQsQ0FBQztJQW5CZ0IsWUFBWTs7WUFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDN0IsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQzthQUM3QjtRQUNMLENBQUM7S0FBQTtJQUVELElBQVcsUUFBUTtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRU0sV0FBVyxDQUFDLFFBQWtCO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFTSxVQUFVLENBQUMsT0FBc0I7UUFDcEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7Q0FDSiJ9