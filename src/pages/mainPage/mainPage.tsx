import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import JobCard from '../../components/jobCard/JobCard';
import myFireBase, { listenForJobChanges } from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import './style.css';

export default function MainPage() {
	const userContext = useContext(UserContext);
	const [jobs, setJobs] = useState<IFullJob[]>([]);

	useEffect(
		() =>
			listenForJobChanges(() => {
				myFireBase.jobs.getJobs().then((jobs) => {
					setJobs(jobs);
				});
			}),
		[]
	);

	const takeJob = (id: string) => {};

	return (
		<div className="card-container">
			{jobs.map((job, index) => (
				<JobCard job={job} key={index} />
			))}
		</div>
	);
}
