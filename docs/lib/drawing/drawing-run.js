export class DrawingRun {
    constructor(bounds) {
        this.bounds = bounds;
    }
    getUsedWidth(_availableWidth) {
        return this.bounds.boundSizeX;
    }
    getHeight(_width) {
        return this.bounds.boundSizeY;
    }
    performLayout(_flow) {
        // Nothing to do for now.
        this.lastXPos = 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLE9BQU8sVUFBVTtJQU9uQixZQUFZLE1BQW1CO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxZQUFZLENBQUMsZUFBdUI7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sU0FBUyxDQUFDLE1BQWM7UUFDM0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sYUFBYSxDQUFDLEtBQWtCO1FBQ25DLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0NBQ0oifQ==