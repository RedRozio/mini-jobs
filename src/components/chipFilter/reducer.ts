export type FilterType = 'taken' | 'available' | 'created';
export type SortType = 'title' | 'price' | 'jobTime' | 'createdTime';

export type SortTypes = {
	sortType: SortType | undefined;
	filters: FilterType[];
};

export type State = {
	label: string;
	value: FilterType | SortType;
	icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
	active?: boolean;
	type: 'sort' | 'filter';
}[];

export type OnSortOrFilterHandler = (
	sortType: SortType | undefined,
	filters: FilterType[]
) => void;

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
