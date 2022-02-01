import { styled, IconButton } from '@mui/material';

const ExpandMore = styled((props: any) => {
	const { expanded, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expanded }) => ({
	transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default ExpandMore;
