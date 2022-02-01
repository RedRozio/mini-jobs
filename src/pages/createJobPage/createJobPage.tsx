import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material';
import myFireBase from '../../utils/myFireBase';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/WorkOutline';

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

	const { handleChange, submitForm, errors, values } = useFormik({
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
							<Grid item xs={12}>
								<TextField
									name="title"
									required
									fullWidth
									autoFocus
									id="title"
									label="Job title"
									error={!!errors.title}
									onChange={handleChange('title')}
									value={values.title}
								/>
								<FormHelperText error>{errors.title}</FormHelperText>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name="description"
									required
									fullWidth
									id="description"
									label="Job description"
									error={!!errors.description}
									multiline
									onChange={handleChange('description')}
									value={values.description}
								/>
								<FormHelperText error>{errors.description}</FormHelperText>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name="price"
									required
									fullWidth
									id="price"
									label="Price"
									error={!!errors.price}
									onChange={handleChange('price')}
									type="number"
									value={values.price}
								/>
								<FormHelperText error>{errors.price}</FormHelperText>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name="image"
									required
									fullWidth
									id="image"
									label="Image link"
									error={!!errors.image}
									onChange={handleChange('image')}
									multiline
									value={values.image}
								/>
								<FormHelperText error>{errors.image}</FormHelperText>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name="date"
									required
									fullWidth
									id="date"
									label="Time"
									type="datetime-local"
									error={!!errors.timeJob}
									onChange={handleChange('timeJob')}
									value={values.timeJob}
								/>
								<FormHelperText error>{errors.timeJob}</FormHelperText>
							</Grid>
						</Grid>
						<Button
							type="submit"
							onClick={submitForm}
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
