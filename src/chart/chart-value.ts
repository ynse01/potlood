
export class ChartValue {
    public numeric: number | undefined = undefined;
    public text: string | undefined = undefined;

    public toString(): string {
        let str = "";
        if (this.numeric !== undefined) {
            str = this.numeric.toString();
        } else if (this.text !== undefined) {
            str = this.text;
        }
        return str;
    }
}