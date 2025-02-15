export class BoundingBoxService {
	private boundingBox: number[] = [];
	public getBoundingBox(): number[] {
		return this.boundingBox;
	}

	public setBoundingBox(value: number[]) {
		this.boundingBox = value;
	}
}
