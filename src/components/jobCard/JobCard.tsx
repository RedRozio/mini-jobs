import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	CardHeader,
	styled,
	IconButton,
	Collapse,
} from '@mui/material';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import myFireBase from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import './jobCard.css';

interface IProps {
	job: IFullJob;
}

const ExpandMore = styled((props: any) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function JobCard({ job }: IProps) {
	const userContext = useContext(UserContext);
	const [expanded, setExpanded] = useState(false);
	const jobStatus =
		job.employee === null
			? 'available'
			: job.employee.id === userContext?.id
			? 'taken'
			: 'unavailable';

	const takeJob = () => myFireBase.jobs.takeJob(job.id);

	return (
		<Card className="card" variant="outlined">
			<CardHeader
				title={job.title}
				subheader={job.timeJob.toDateString()}
				action={
					<Typography variant="body1" component="div">
						kr {job.price}
					</Typography>
				}
			/>

			<CardActions disableSpacing>
				{getApplyButton(jobStatus, takeJob)}
				<ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)}>
					<ExpandMoreIcon />
				</ExpandMore>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography>{job.description}</Typography>
					<br />
					<Typography variant="body2" color="text.secondary" textAlign="right">
						{/* Job created at <br /> */}
						{job.employer.firstName} {job.employer.lastName}
						<br />
						{job.timeCreated.toDateString()}
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}

const getApplyButton = (jobStatus: string, takeJob: () => void) => {
	if (jobStatus === 'available')
		return (
			<Button onClick={takeJob} variant="text" color="primary">
				Take job
			</Button>
		);
	/* 		if (jobStatus === "taken")
		return (
			<Button
				onClick={() => takeJob(job.id)}
				// disabled={job.employee !== null}
				variant="outlined"
				color="primary"
				startIcon={<Work />}>
				Untake job
			</Button>
		); */

	return (
		<Button disabled variant="text" color="primary">
			Job taken
		</Button>
	);
};
