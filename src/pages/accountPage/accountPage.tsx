import * as React from 'react';
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
import { AccountCircle, Check } from '@mui/icons-material';
import { ISimpleUser } from '../../utils/types';
import { UserContext } from '../../App';
import FormField from '../../components/formField/formField';

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

	const formik = useFormik({
		initialValues: initialValues ?? initialValuesConst,
		onSubmit,
		validationSchema,
		enableReinitialize: true,
	});
	const { handleChange, submitForm, errors, values } = formik;

	React.useEffect(() => {
		let state = false;
		for (let key in initialValues) {
			const iv = initialValues as any;
			const v = values as any;
			if (iv[key] !== v[key]) {
				state = true;
				break;
			}
		}
		if (state) {
			setButtonState('unsavedChanges');
		} else {
			setButtonState('noChanges');
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
						<FormField formik={formik} id="firstName" title="First name" />
						<FormField formik={formik} id="lastName" title="Last name" />
						<FormField
							formik={formik}
							id="employeeDescription"
							title="Employee description"
							fullWidth
						/>
						<FormField
							formik={formik}
							id="employerDescription"
							title="Employer description"
							fullWidth
						/>
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
