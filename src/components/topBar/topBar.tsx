import {
	AccountCircle as AccountCircleIcon,
	Work as WorkIcon,
} from '@mui/icons-material';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	Menu,
	MenuItem,
	PopoverOrigin,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import myFireBase from '../../utils/myFireBase';

const anchorOrigin: PopoverOrigin = {
	vertical: 'top',
	horizontal: 'right',
};

export default function TopBar() {
	const user = useContext(UserContext);

	const [anchorEl, setAnchorEl] = useState<any>(null);
	const navigate = useNavigate();

	const handleMenu = (e: any) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleSignOut = () => {
		myFireBase.auth.signOut().then(() => {
			navigate('/signin');
		});
	};
	const createJob = () => navigate('createJob');
	const handleAccount = () => navigate('/account');
	const handleSignIn = () => navigate('/signin');

	return (
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
					{user && (
						<Button color="inherit" onClick={createJob}>
							Create job
						</Button>
					)}
					<IconButton size="large" onClick={handleMenu} color="inherit">
						<AccountCircleIcon />
					</IconButton>
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={anchorOrigin}
						keepMounted
						transformOrigin={anchorOrigin}
						open={Boolean(anchorEl)}
						onClose={handleClose}>
						{user ? (
							<MenuItem onClick={handleAccount}>Account</MenuItem>
						) : (
							<MenuItem onClick={handleSignIn}>Sign in</MenuItem>
						)}
						{user && <MenuItem onClick={handleSignOut}>Sign out</MenuItem>}
					</Menu>
				</div>
			</Toolbar>
		</AppBar>
	);
}
