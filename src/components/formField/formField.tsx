import { FormHelperText, Grid, TextField } from '@mui/material';

interface Props {
	formik: {
		errors: any;
		values: any;
		handleChange: {
			(e: React.ChangeEvent<any>): void;
			<T_1 = string | React.ChangeEvent<any>>(
				field: T_1
			): T_1 extends React.ChangeEvent<any>
				? void
				: (e: string | React.ChangeEvent<any>) => void;
		};
	};
	id: string;
	title: string;
	number?: boolean;
	date?: boolean;
	multiline?: boolean;
	password?: boolean;
	fullWidth?: boolean;
	autofocus?: boolean;
}

export default function FormField({
	formik,
	id,
	title,
	number,
	date,
	multiline,
	password,
	fullWidth,
	autofocus,
}: Props) {
	const { errors, handleChange, values } = formik;
	return (
		<Grid item xs={fullWidth ? 12 : 6}>
			<TextField
				name={id}
				fullWidth
				autoFocus={autofocus}
				id={id}
				label={title}
				error={!!errors[id]}
				onChange={handleChange(id)}
				value={values[id]}
				type={
					number ? 'number' : date ? 'date' : password ? 'password' : 'text'
				}
				multiline={multiline}
				InputLabelProps={date ? { shrink: true } : {}}
			/>
			<FormHelperText error>{errors[id]}</FormHelperText>
		</Grid>
	);
}
