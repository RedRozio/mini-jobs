import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { createContext, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from './constants/theme';
import MainPage from './pages/mainPage/mainPage';
import SigninPage from './pages/signinPage/signinPage';
import SignupPage from './pages/signupPage/signupPage';
import CreateJobPage from './pages/createJobPage/createJobPage';
import myFireBase from './utils/myFireBase';
import { IUser } from './utils/types';
import AccountPage from './pages/accountPage/accountPage';

export const UserContext = createContext<IUser | null>(null);

function App() {
	// State for when user is logged in or not
	const [userState, setUserState] = useState<IUser | null>(null);

	// Listen for auth state changes
	React.useEffect(
		() => myFireBase.listeners.listenForAuthChanges(setUserState),
		[]
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<UserContext.Provider value={userState}>
				<BrowserRouter>
					<Routes>
						<Route index element={<MainPage />} />
						<Route path="signup" element={<SignupPage />} />
						<Route path="signin" element={<SigninPage />} />
						<Route path="createJob" element={<CreateJobPage />} />
						<Route path="account" element={<AccountPage />} />
					</Routes>
				</BrowserRouter>
			</UserContext.Provider>
		</ThemeProvider>
	);
}

export default App;
