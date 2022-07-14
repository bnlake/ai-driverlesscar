export default class Level {
	inputs;
	outputs;
	biases;
	weights;

	constructor(inputCount: number, outputCount: number) {
		console.log(inputCount, outputCount);
		this.inputs = new Array(inputCount);
		this.outputs = new Array(outputCount);
		this.biases = new Array(outputCount);

		this.weights = new Array();
		for (let i = 0; i < inputCount; i++) {
			this.weights[i] = new Array(outputCount);
		}

		Level.randomize(this);
	}

	/**
	 * Temporary function to get neural biases and weigghts working
	 */
	public static randomize(level: Level) {
		for (let i = 0; i < level.inputs.length; i++) {
			for (let j = 0; j < level.outputs.length; j++) {
				level.weights[i][j] = Math.random() * 2 - 1;
			}
		}

		for (let i = 0; i < level.biases.length; i++) {
			level.biases[i] = Math.random() * 2 - 1;
		}
	}

	public static feedForward(givenInputs: Array<number>, level: Level): Array<number> {
		for (let i = 0; i < level.inputs.length; i++) {
			level.inputs[i] = givenInputs[i];
		}

		for (let i = 0; i < level.outputs.length; i++) {
			let sum = 0;
			for (let j = 0; j < level.inputs.length; j++) {
				sum += level.inputs[j] * level.weights[j][i];
			}

			if (sum > level.biases[i]) level.outputs[i] = 1;
			else level.outputs[i] = 0;
		}

		return level.outputs;
	}
}
