import { useContext, useEffect, useState } from 'react';
import JobCard from '../../components/jobCard/JobCard';
import myFireBase from '../../utils/myFireBase';
import { IFullJob } from '../../utils/types';
import './style.css';
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Button,
	PopoverOrigin,
} from '@mui/material';
import { AccountCircle, WorkOutline as WorkIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const anchorOrigin: PopoverOrigin = {
	vertical: 'top',
	horizontal: 'right',
};

export default function MainPage() {
	const [jobs, setJobs] = useState<IFullJob[]>([]);
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const navigate = useNavigate();
	const user = useContext(UserContext);

	useEffect(() => myFireBase.listeners.listenForJobChanges(setJobs), []);

	const handleMenu = (e: any) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleSignOut = () => {
		myFireBase.auth.signOut().then(() => {
			navigate('/signin');
		});
	};
	const createJob = () => navigate('createJob');
	const handleAccount = () => navigate('/account');

	return (
		<div>
			<AppBar position="sticky">
				<Toolbar>
					<WorkIcon />
					<div style={{ width: '0.5rem' }}></div>
					<Typography variant="h6" component="div">
						Mini jobs
					</Typography>
					<div style={{ width: '3rem' }}></div>
					<Typography variant="body1" component="div">
						{user
							? `Signed in as ${user.firstName} ${user.lastName}`
							: 'Not signed in'}
					</Typography>
					<div style={{ flexGrow: 1 }}></div>
					<div>
						<Button color="inherit" onClick={createJob}>
							Create job
						</Button>
						<IconButton size="large" onClick={handleMenu} color="inherit">
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={anchorOrigin}
							keepMounted
							transformOrigin={anchorOrigin}
							open={Boolean(anchorEl)}
							onClose={handleClose}>
							<MenuItem onClick={handleAccount}>Account</MenuItem>
							<MenuItem onClick={handleSignOut}>Sign out</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<div className="card-container">
				{jobs.map((job, index) => (
					<JobCard job={job} key={index} />
				))}
			</div>
		</div>
	);
}
