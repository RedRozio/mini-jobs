import { Paper, Chip } from '@mui/material';
import { useEffect, useReducer } from 'react';
import reducer, {
	FilterType,
	OnSortOrFilterHandler,
	SortType,
	State,
} from './reducer';
import SortIcon from '@mui/icons-material/Sort';
import FilterIcon from '@mui/icons-material/FilterAlt';
import './style.css';

const initialState: State = [
	{
		label: 'Title',
		value: 'title',
		type: 'sort',
	},
	{
		label: 'Price',
		value: 'price',
		type: 'sort',
	},
	{
		label: 'Job time',
		value: 'jobTime',
		type: 'sort',
	},
	{
		label: 'Created time',
		value: 'createdTime',
		type: 'sort',
	},
	{
		label: 'Taken',
		value: 'taken',
		type: 'filter',
	},
	{
		label: 'Created by me',
		value: 'created',
		type: 'filter',
	},
	{
		label: 'Available',
		value: 'available',
		type: 'filter',
	},
];

interface Props {
	onSortOrFilter: OnSortOrFilterHandler;
}

const CHIP_MARGIN = 0.75;

const chipMarginMargin = {
	margin: CHIP_MARGIN,
};

export default function ChipFilter(props: Props) {
	const [state, updateState] = useReducer(reducer, initialState);

	useEffect(() => {
		const sortType =
			(state.find((chip) => chip.active && chip.type === 'sort')
				?.value as SortType) ?? undefined;
		const filters = state
			.filter((chip) => chip.active && chip.type === 'filter')
			.map((chip) => chip.value) as FilterType[];
		props.onSortOrFilter(sortType, filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	return (
		<Paper
			variant="outlined"
			className="chip-container"
			sx={{
				p: CHIP_MARGIN * 2,
			}}
			component="div">
			<Chip icon={<SortIcon />} label="Sort" sx={chipMarginMargin} />
			{state.map(({ active, icon, label, type }, index) => {
				return (
					type === 'sort' && (
						<Chip
							key={index}
							icon={icon}
							label={label}
							onClick={() => updateState(index)}
							variant={active ? 'filled' : 'outlined'}
							color={active ? 'primary' : undefined}
							sx={{
								margin: CHIP_MARGIN,
							}}
						/>
					)
				);
			})}
			<Chip icon={<FilterIcon />} label="Filter" sx={chipMarginMargin} />
			{state.map(
				({ active, icon, label, type }, index) =>
					type === 'filter' && (
						<Chip
							key={index}
							icon={icon}
							label={label}
							onClick={() => updateState(index)}
							variant={active ? 'filled' : 'outlined'}
							color={active ? 'primary' : undefined}
							sx={chipMarginMargin}
						/>
					)
			)}
		</Paper>
	);
}
