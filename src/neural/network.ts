import { InputCount } from '../types';
import Level from './level';

export default class NeuralNetwork {
	levels: Array<Level>;

	constructor(public neuronCount: Array<number>) {
		this.levels = new Array();
		for (let i = 0; i < neuronCount.length - 1; i++) {
			this.levels.push(new Level(neuronCount[i], neuronCount[i + 1]));
		}
	}

	public static feedForward(givenInputs: InputCount, network: NeuralNetwork | null) {
		if (!network) return;

		let outputs = Level.feedForward(givenInputs, network.levels[0]);
		for (let i = 1; i < network.levels.length; i++) {
			outputs = Level.feedForward(outputs, network.levels[i]);
		}

		return outputs;
	}
}
