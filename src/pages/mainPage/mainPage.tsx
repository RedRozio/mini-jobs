import { useEffect, useState } from 'react';
import JobCard from '../../components/jobCard/JobCard';
import myFireBase from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import './style.css';

export default function MainPage() {
	const [jobs, setJobs] = useState<IFullJob[]>([]);

	useEffect(
		() =>
			myFireBase.listeners.listenForJobChanges(() =>
				myFireBase.jobs.getJobs().then(setJobs)
			),
		[]
	);

	return (
		<div className="card-container">
			{jobs.map((job, index) => (
				<JobCard job={job} key={index} />
			))}
		</div>
	);
}
