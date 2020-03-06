

export enum FractionType {
    NoBar,
    Bar,
    Skewed,
    Linear
}

export class FractionStyle {
    public type: FractionType = FractionType.NoBar;

    public setType(typeStr: string | undefined): void {
        switch (typeStr) {
            case "bar":
                this.type = FractionType.Bar;
                break;
            case "skw":
                this.type = FractionType.Skewed;
                break;
            case "lin":
                this.type = FractionType.Linear;
                break;
            case "noBar":
            default:
                this.type = FractionType.NoBar;
                break;
        }
    }
}