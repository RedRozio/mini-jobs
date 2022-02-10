import { State } from './types';

export default function reducer(state: State, index: number) {
	const item = state[index];
	if (!state[index].active) {
		if (item.type === 'sort') {
			state = state.map((chip) =>
				chip.type === 'sort'
					? {
							...chip,
							active: false,
					  }
					: chip
			);
		}
		state[index].active = true;
	} else {
		if (item.type !== 'sort') state[index].active = false;
	}
	return [...state];
}
