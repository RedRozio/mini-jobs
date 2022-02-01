import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	CardHeader,
	Collapse,
	CardMedia,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import myFireBase from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import ExpandMore from './ExpandMore';
import './jobCard.css';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface IProps {
	job: IFullJob;
}

export default function JobCard({ job }: IProps) {
	const userContext = useContext(UserContext);
	const [expanded, setExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const jobStatus =
		job.employee === null
			? 'available'
			: job.employee.id === userContext?.id
			? 'taken'
			: 'unavailable';
	const isJobOwner = job.employer.id === userContext?.id;
	const navigate = useNavigate();

	const takeJob = () => {
		myFireBase.jobs.takeJob(job.id).catch(() => {
			navigate('/signin');
		});
	};
	const untakeJob = () => myFireBase.jobs.untakeJob(job.id);
	const handleMenu = (e: any) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);

	const handleDeleteJob = () => {
		myFireBase.jobs.deleteJob(job.id);
	};

	return (
		<Card className="card" variant="outlined">
			<CardMedia component="img" height="120" image={job.image} />
			<CardHeader
				title={job.title}
				subheader={`${formatDate(job.timeJob)} • ${job.price}kr`}
				action={
					isJobOwner && (
						<div>
							<IconButton onClick={handleMenu}>
								<MoreVertIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorEl)}
								onClose={handleClose}>
								<MenuItem onClick={handleClose}>Edit</MenuItem>
								<MenuItem onClick={handleDeleteJob}>Delete</MenuItem>
							</Menu>
						</div>
					)
				}
			/>
			<CardActions disableSpacing>
				{!isJobOwner && getApplyButton(jobStatus, takeJob, untakeJob)}
				<ExpandMore expanded={expanded} onClick={() => setExpanded(!expanded)}>
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
						{formatDate(job.timeCreated)}
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}

const getApplyButton = (
	jobStatus: string,
	takeJob: () => void,
	untakeJob: () => void
) => {
	if (jobStatus === 'available')
		return (
			<Button onClick={takeJob} color="primary">
				Take job
			</Button>
		);
	if (jobStatus === 'taken')
		return (
			<Button onClick={untakeJob} color="error">
				Cancel job
			</Button>
		);

	return (
		<Button disabled variant="text" color="primary">
			Unavailable
		</Button>
	);
};
