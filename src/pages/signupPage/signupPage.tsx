import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material';
import myFireBase from '../../utils/myFireBase';
import { useNavigate } from 'react-router-dom';

const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	employeeDescription: '',
	employerDescription: '',
};

const requiredString = Yup.string().required('This field is required');
const validationSchema = Yup.object().shape({
	firstName: requiredString,
	lastName: requiredString,
	email: requiredString.email('Invalid email'),
	password: requiredString.min(6, 'Mininum 6 characters'),
	employeeDescription: Yup.string(),
	employerDescription: Yup.string(),
});

export default function SignupPage() {
	const navigate = useNavigate();

	const onSubmit = (formValues: typeof initialValues) => {
		myFireBase.auth.createAccount(formValues).then((user) => {
			navigate('/');
		});
	};

	const { handleChange, submitForm, errors } = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
	});

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								name="firstName"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
								error={!!errors.firstName}
								onChange={handleChange('firstName')}
							/>
							<FormHelperText error>{errors.firstName}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="family-name"
								error={!!errors.lastName}
								onChange={handleChange('lastName')}
							/>
							<FormHelperText error>{errors.lastName}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								error={!!errors.email}
								onChange={handleChange('email')}
							/>
							<FormHelperText error>{errors.email}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
								error={!!errors.password}
								onChange={handleChange('password')}
							/>
							<FormHelperText error>{errors.password}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name="employeeDescription"
								label="Employee Description (optional)"
								type="text"
								id="employeeDescription"
								error={!!errors.employeeDescription}
								onChange={handleChange('employeeDescription')}
							/>
							<FormHelperText error>
								{errors.employeeDescription}
							</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name="employerDescription"
								label="Employer Description (optional)"
								type="text"
								id="employerDescription"
								error={!!errors.employerDescription}
								onChange={handleChange('employerDescription')}
							/>
							<FormHelperText error>
								{errors.employerDescription}
							</FormHelperText>
						</Grid>
					</Grid>
					<Button
						onClick={submitForm}
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/signin" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
