import { IFullJob } from '../../utils/types';
import { SortTypes } from './types';

export default function sortJobs(
	currentState: IFullJob[],
	sortTypes: SortTypes,
	userId: string | undefined
): IFullJob[] {
	const { filters, sortType } = sortTypes;
	// Filter out first
	filters.forEach((filter) => {
		currentState = currentState.filter((job) => {
			switch (filter) {
				case 'available':
					return job.employee === null;
				case 'created':
					return job.employer.id === userId;
				case 'taken':
					return job.employee?.id === userId;
				default:
					return true;
			}
		});
	});

	currentState = currentState.sort((a, b) => {
		switch (sortType) {
			case 'price':
				return a.price - b.price;
			case 'jobTime':
				return a.timeJob.getTime() - b.timeJob.getTime();
			case 'createdTime':
				return a.timeCreated.getTime() - b.timeCreated.getTime();
			case 'title':
				return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
			default:
				return 0;
		}
	});
	return [...currentState];
}
