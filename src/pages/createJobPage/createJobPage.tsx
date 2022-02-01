import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import myFireBase from '../../utils/myFireBase';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/WorkOutline';
import FormField from '../../components/formField/formField';

const initialValues = {
	title: '',
	description: '',
	image: '',
	price: 0,
	timeJob: new Date(),
};

const requiredString = Yup.string().required('This field is required');
const validationSchema = Yup.object().shape({
	title: requiredString,
	description: requiredString,
	image: requiredString,
	price: Yup.number()
		.required('This field is required')
		.min(1, 'Price must be a positive number'),
	timeJob: Yup.date().required('A date is required'),
});

export default function SignupPage() {
	const navigate = useNavigate();

	const onSubmit = (formValues: typeof initialValues) => {
		myFireBase.jobs
			.createJob({ ...formValues, timeJob: new Date(formValues.timeJob) })
			.then(() => {
				navigate('/');
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
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<WorkIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create job
				</Typography>
				<Box sx={{ mt: 3 }}>
					<form onSubmit={(e) => e.preventDefault()}>
						<Grid container spacing={2}>
							<FormField
								formik={formik}
								id="title"
								title="Job title"
								fullWidth
							/>
							<FormField
								formik={formik}
								id="description"
								title="Job description"
								fullWidth
							/>
							<FormField
								formik={formik}
								id="price"
								title="Price"
								fullWidth
								number
							/>
							<FormField
								formik={formik}
								id="image"
								title="Image link"
								fullWidth
								number
								multiline
							/>
							<FormField
								formik={formik}
								id="date"
								title="Time"
								fullWidth
								date
							/>
						</Grid>
						<Button
							type="submit"
							onClick={formik.submitForm}
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Create Job
						</Button>
					</form>
				</Box>
			</Box>
		</Container>
	);
}
