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
import './style.css';
import { AccountCircle, Check } from '@mui/icons-material';
import { ISimpleUser } from '../../utils/types';
import { UserContext } from '../../App';

const initialValuesConst = {
	firstName: '',
	lastName: '',
	employeeDescription: '',
	employerDescription: '',
};

const requiredString = Yup.string().required('This field is required');
const validationSchema = Yup.object().shape({
	firstName: requiredString,
	lastName: requiredString,
	employeeDescription: requiredString,
	employerDescription: requiredString,
});

type ButtonState = 'noChanges' | 'unsavedChanges' | 'savedChanges';
export default function SignupPage() {
	const [initialValues, setInitialValues] = React.useState<null | ISimpleUser>(
		null
	);
	const [buttonState, setButtonState] =
		React.useState<ButtonState>('noChanges');
	const navigate = useNavigate();
	const user = React.useContext(UserContext);

	React.useEffect(() => {
		myFireBase.users
			.getUser(user?.id ?? '')
			.then((user) => {
				setInitialValues(user);
				setButtonState('noChanges');
			})
			.catch((e) => {
				console.log(e);
			});
	}, [user]);

	const onSubmit = (formValues: ISimpleUser) => {
		myFireBase.users.editUser(formValues).then(() => {
			setButtonState('savedChanges');
			setTimeout(() => {
				setButtonState('noChanges');
			}, 1000);
		});
	};

	const { handleChange, submitForm, errors, values } = useFormik({
		initialValues: initialValues ?? initialValuesConst,
		onSubmit,
		validationSchema,
		enableReinitialize: true,
	});

	React.useEffect(() => {
		for (let key in initialValues) {
			const iv = initialValues as any;
			const v = values as any;
			if (iv[key] !== v[key]) {
				setButtonState('unsavedChanges');
				break;
			}
		}
	}, [initialValues, values]);

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
				<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
					<AccountCircle />
				</Avatar>
				<Typography component="h1" variant="h5">
					Account
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
								error={!!errors.firstName}
								onChange={handleChange('firstName')}
								value={values.firstName}
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
								value={values.lastName}
							/>
							<FormHelperText error>{errors.lastName}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name="employeeDescription"
								required
								label="Employee Description"
								type="text"
								id="employeeDescription"
								error={!!errors.employeeDescription}
								onChange={handleChange('employeeDescription')}
								value={values.employeeDescription}
							/>
							<FormHelperText error>
								{errors.employeeDescription}
							</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="employerDescription"
								label="Employer Description"
								type="text"
								id="employerDescription"
								error={!!errors.employerDescription}
								onChange={handleChange('employerDescription')}
								value={values.employerDescription}
							/>
							<FormHelperText error>
								{errors.employerDescription}
							</FormHelperText>
						</Grid>
					</Grid>
					<Button
						disabled={buttonState === 'noChanges'}
						onClick={submitForm}
						fullWidth
						type="submit"
						variant="contained"
						startIcon={buttonState === 'savedChanges' && <Check />}
						color={buttonState === 'savedChanges' ? 'success' : 'primary'}
						sx={{ mt: 3, mb: 2 }}>
						{buttonState === 'noChanges'
							? 'No changes'
							: buttonState === 'savedChanges'
							? 'Saved'
							: 'Save changes'}
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
