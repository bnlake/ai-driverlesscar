export default class Controls {
	constructor(
		private forward: boolean = false,
		private reverse: boolean = false,
		private left: boolean = false,
		private right: boolean = false
	) {
		this.addEventListeners();
	}

	private addEventListeners() {
		document.onkeydown = (event) => {
			switch (event.key) {
				case 'ArrowLeft':
					this.left = true;
					break;
				case 'ArrowRight':
					this.right = true;
					break;
				case 'ArrowUp':
					this.forward = true;
					break;
				case 'ArrowDown':
					this.reverse = true;
					break;
				default:
					break;
			}
		};

		document.onkeyup = (event) => {
			switch (event.key) {
				case 'ArrowLeft':
					this.left = false;
					break;
				case 'ArrowRight':
					this.right = false;
					break;
				case 'ArrowUp':
					this.forward = false;
					break;
				case 'ArrowDown':
					this.reverse = false;
					break;
				default:
					break;
			}
		};
	}
}
