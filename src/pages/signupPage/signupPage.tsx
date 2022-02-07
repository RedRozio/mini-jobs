import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import myFireBase from '../../utils/myFireBase';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/formField/formField';
import GoHomeButton from '../../components/goHomeButton/goHomeButton';

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
	employeeDescription: requiredString,
	employerDescription: requiredString,
});

export default function SignupPage() {
	const navigate = useNavigate();

	const onSubmit = (formValues: typeof initialValues) => {
		myFireBase.auth
			.createAccount(formValues)
			.then(() => {
				navigate('/');
			})
			.catch((e: Error) => {
				if (e.message.includes('email-already-in-use')) {
					formik.setErrors({
						...formik.errors,
						email: 'Email already in use',
					});
				}
			});
	};

	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
	});

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
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
						<FormField
							formik={formik}
							id="firstName"
							title="First name"
							fullWidth
							autofocus
						/>
						<FormField
							formik={formik}
							id="lastName"
							title="Last name"
							fullWidth
						/>
						<FormField
							formik={formik}
							id="email"
							title="Email address"
							fullWidth
						/>
						<FormField
							formik={formik}
							id="password"
							title="Password"
							fullWidth
							password
						/>
						<FormField
							formik={formik}
							id="employeeDescription"
							title="Employee description"
							fullWidth
							multiline
						/>
						<FormField
							formik={formik}
							id="employerDescription"
							title="Employer description"
							fullWidth
							multiline
						/>
					</Grid>
					<Button
						onClick={formik.submitForm}
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
				<br />
				<GoHomeButton />
			</Box>
		</Container>
	);
}
