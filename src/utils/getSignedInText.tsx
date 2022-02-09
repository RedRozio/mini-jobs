const getSignedInText = (
	isSignedIn: boolean,
	isMobile: boolean,
	userName: string
) => {
	if (isMobile) {
		if (isSignedIn) {
			return 'Signed in';
		} else {
			return 'Signed out';
		}
	} else {
		if (isSignedIn) {
			return 'Signed in as ' + userName;
		} else {
			return 'Signed out';
		}
	}
};

export default getSignedInText;
