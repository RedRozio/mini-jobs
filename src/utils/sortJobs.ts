import { SortTypes } from '../components/chipFilter/reducer';
import { IFullJob } from './types';

export default function sortJobs(
	currentState: IFullJob[],
	sortTypes: SortTypes,
	userId: string | undefined
): IFullJob[] {
	const { filters, sortType } = sortTypes;
	// Filter out first
	filters.forEach((filter) => {
		if (filter === 'available') {
			currentState = currentState.filter((job) => job.employee === null);
		}
		if (filter === 'taken') {
			currentState = currentState.filter((job) => job.employee?.id === userId);
		}
		if (filter === 'created') {
			currentState = currentState.filter((job) => job.employer.id === userId);
		}
	});

	currentState = currentState.sort((a, b) => {
		if (sortType === 'price') {
			return a.price - b.price;
		}
		if (sortType === 'jobTime') {
			return a.timeJob.getTime() - b.timeJob.getTime();
		}
		if (sortType === 'createdTime') {
			return a.timeCreated.getTime() - b.timeCreated.getTime();
		}
		if (sortType === 'title') {
			return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
		}
		return 0;
	});
	return [...currentState];
}
