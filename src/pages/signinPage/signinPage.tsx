import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
	Avatar,
	Button,
	CssBaseline,
	Link,
	Grid,
	Box,
	Typography,
	Container,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import myFireBase from '../../utils/myFireBase';
import { useNavigate } from 'react-router-dom';
import './style.css';
import FormField from '../../components/formField/formField';

const initialValues = {
	email: '',
	password: '',
};

const requiredString = Yup.string().required('This field is required');
const validationSchema = Yup.object().shape({
	email: requiredString.email('Invalid email'),
	password: requiredString.min(6, 'Mininum 6 characters'),
});

export default function SigninPage() {
	const navigate = useNavigate();

	const onSubmit = (formValues: typeof initialValues) =>
		myFireBase.auth
			.signIn(formValues)
			.then(() => navigate('/'))
			.catch((e: Error) => {
				if (e.message.includes('user-not-found')) {
					setErrors({
						...errors,
						email: 'No user with given email address',
					});
				} else if (e.message.includes('wrong-password')) {
					setErrors({
						...errors,
						password: 'Wrong password',
					});
				} else {
					alert('Sorry, something went wrong ...');
				}
			});

	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
	});
	const { submitForm, errors, setErrors } = formik;

	return (
		<Container component="main" maxWidth="xs" className="main">
			<CssBaseline />
			<Box className="center">
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box sx={{ mt: 3 }}>
					<form onSubmit={(e) => e.preventDefault()}>
						<Grid container spacing={2}>
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
						</Grid>
						<Button
							type="submit"
							onClick={submitForm}
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/signup" variant="body2">
									Don't have an account? Sign up
								</Link>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Box>
		</Container>
	);
}
