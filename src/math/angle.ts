export class Angle {
    private _degrees: number = 0;

    private constructor(degrees: number) {
        this._degrees = degrees;
    }

    public static fromRotation(rot: number): Angle {
        return new Angle(rot / 60000);
    }

    public static fromDegrees(degrees: number): Angle {
        return new Angle(degrees);
    }

    public static fromRadians(rad: number): Angle {
        return new Angle(rad * 180 / Math.PI);
    }

    public static fromNormalized(norm: number): Angle {
        return new Angle(norm * 360);
    }

    public add(other: Angle): Angle {
        return new Angle(this._degrees + other._degrees);
    }

    public subtract(other: Angle): Angle {
        return new Angle(this._degrees - other._degrees);
    }

    public round(fullCircle: boolean): void {
        if (!fullCircle || this._degrees !== 360) {
            this._degrees = (this._degrees + 360) % 360;
        }
    }

    public toDegrees(): number {
        return this._degrees;
    }

    public toRadians(): number {
        return this._degrees * Math.PI / 180;
    }

    public toRotation(): number {
        return this._degrees * 60000;
    }

    public toString(): string {
        return `${this._degrees}°`;
    }
}