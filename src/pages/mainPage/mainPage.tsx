import { useContext, useEffect, useState } from 'react';
import JobCard from '../../components/jobCard/JobCard';
import myFireBase from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import './style.css';
import { UserContext } from '../../App';
import ChipFilter from '../../components/chipFilter/chipFilter';
import sortJobs from '../../components/chipFilter/sortJobs';
import TopBar from '../../components/topBar/topBar';
import {
	SortTypes,
	OnSortOrFilterHandler,
} from '../../components/chipFilter/types';

const initialSortTypes = {
	sortType: undefined,
	filters: [],
};

export default function MainPage() {
	const user = useContext(UserContext);

	const [jobs, setJobs] = useState<IFullJob[]>([]);
	const [sortedJobs, setSortedJobs] = useState<IFullJob[]>([]);
	const [sortTypes, setSortTypes] = useState<SortTypes>(initialSortTypes);

	useEffect(() => myFireBase.listeners.listenForJobChanges(setJobs), []);
	useEffect(
		() => setSortedJobs(sortJobs(jobs, sortTypes, user?.id)),
		[sortTypes, jobs, user?.id]
	);

	const handleOnSortOrFilter: OnSortOrFilterHandler = (sortType, filters) => {
		setSortTypes({
			sortType,
			filters,
		});
	};

	return (
		<div>
			<TopBar />
			<ChipFilter onSortOrFilter={handleOnSortOrFilter} />
			<div className="card-container">
				{sortedJobs.map((job, index) => (
					<JobCard job={job} key={index} />
				))}
			</div>
		</div>
	);
}
