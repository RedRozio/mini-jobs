import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GoHomeButton() {
	const navigate = useNavigate();

	return <Button onClick={() => navigate('/')}>Go home</Button>;
}
