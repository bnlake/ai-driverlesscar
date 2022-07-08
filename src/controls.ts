export default class Controls {
	constructor(
		public forward: boolean = false,
		public reverse: boolean = false,
		public left: boolean = false,
		public right: boolean = false
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
