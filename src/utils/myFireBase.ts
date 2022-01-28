import { initializeApp } from 'firebase/app';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	Unsubscribe,
} from 'firebase/auth';
import { ISimpleUser, IUser, IFullJob } from './types';
import firebaseConfig from '../constants/firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getUserDocRef = (id: string) => {
	return doc(db, `users/${id}`);
};

const getCurrentUser = () => {
	const user = auth.currentUser;
	if (!user) throw new Error('Not currently signed in');
	return user;
};

const timestampToDate = (timeStamp: {
	seconds: number;
	nanoseconds: number;
}): Date => new Timestamp(timeStamp.seconds, timeStamp.nanoseconds).toDate();

const jobsQuery = query(collection(db, 'jobs'), orderBy('title'));

/**
 * Listens to auth changes, and takes a listener to send the user object
 * @param listener Function that accepts the user to do something
 * @returns The unsubscribe function to stop listening
 */
export const listenForAuthChanges = (
	listener: (user: IUser | null) => void
): Unsubscribe =>
	auth.onAuthStateChanged(async (user) => {
		if (user) {
			const { uid: id } = user;
			const userDoc = await getDoc(getUserDocRef(id));
			const completeUser = {
				id,
				...userDoc.data(),
			} as IUser;

			listener(completeUser);
		} else listener(null);
	});

export const listenForJobChanges = (listener: () => void) => {
	const unsubscribe = onSnapshot(jobsQuery, () => {
		listener();
	});
	return unsubscribe;
};

interface UserParameter {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	employeeDescription?: string;
	employerDescription?: string;
}

/**
 * Authenticates a user with email and password, and saves data on the users collection
 * @param user User information to use for authentication and document
 * @returns A user object containing information from the users collection
 */
const createAccount = async (user: UserParameter): Promise<IUser> => {
	const {
		email,
		password,
		firstName,
		lastName,
		employeeDescription,
		employerDescription,
	} = user;

	const { user: newUser } = await createUserWithEmailAndPassword(
		auth,
		email,
		password
	);

	const userDoc = {
		firstName,
		lastName,
		employeeDescription: employeeDescription ?? '',
		employerDescription: employerDescription ?? '',
	};

	// Creates document with user UID as the ID
	await setDoc(getUserDocRef(newUser.uid), userDoc);
	return { ...userDoc, id: newUser.uid };
};

/**
 * Signs in a user with the given parameters
 * @param email Email to use
 * @param password Password to use
 * @returns User object with UID
 */
const signIn = async (email: string, password: string): Promise<IUser> => {
	const { user: authUser } = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);

	const userDoc = await getDoc(getUserDocRef(authUser.uid));
	return userDoc.data() as IUser;
};

/**
 * Deletes a user in auth and in database
 * @param uid The email and password of the user to delete
 */
const deleteAccount = async (email: string, password: string) => {
	// const { user } = await signInWithEmailAndPassword(auth, email, password);
	const user = auth.currentUser;
	if (!user) throw new Error('Not currently signed in');
	await deleteDoc(getUserDocRef(user.uid));
	await user.delete();
};

const getUser = async (id: string): Promise<ISimpleUser> => {
	const userDoc = await getDoc(doc(db, `users/${id}`));
	return userDoc.data() as ISimpleUser;
};

// deleteUser('anders.morille@gmail.com', 'abc123');

interface JobParameter {
	title: string;
	description: string;
	// employer: string
	image: string;
	price: number;
	// timeCreated: Date,
	timeJob: Date;
}

/**
 * Creates a job doc using the given information
 * The employer field id is gotten from the currentUser
 * @param job Needed job information
 * @returns The id of the newly created job doc
 */
const createJob = async (job: JobParameter) => {
	const jobObject = {
		...job,
		timeCreated: new Date(),
		employee: '',
		employer: getCurrentUser().uid,
	};
	const jobDoc = await addDoc(collection(db, 'jobs'), jobObject);
	return jobDoc.id;
};

/**
 * Deletes a given job
 * @param id The id of the job to delete
 */
const deleteJob = async (id: string) => {
	await deleteDoc(doc(db, `jobs/${id}`));
};

/**
 * Fetches all jobs in the database
 * @returns Array of job objects
 */
const getJobs = async (): Promise<IFullJob[]> => {
	const docs = (await getDocs(jobsQuery)).docs;
	const promises: Promise<IFullJob>[] = [];
	for (let i = 0; i < docs.length; i++) {
		promises.push(getJob(docs[i].id) as Promise<IFullJob>);
	}
	return Promise.all(promises);
};

const getJob = async (id: string): Promise<IFullJob | null> => {
	const docRef = doc(db, `jobs/${id}`);
	const jobDoc = await getDoc(docRef);
	if (!jobDoc.exists()) return null;
	const jobDocData = jobDoc.data() as any;
	const fullJobDocData: IFullJob = {
		...jobDocData,
		id: jobDoc.id,
		employer: {
			...(await getUser(jobDocData.employer)),
			id: jobDocData.employer,
		},
		employee: jobDocData.employee.length
			? { ...(await getUser(jobDocData.employee)), id: jobDocData.employee }
			: null,
		timeCreated: timestampToDate(jobDocData.timeCreated),
		timeJob: timestampToDate(jobDocData.timeJob),
	};
	return fullJobDocData;
};

/**
 * Tries to take a job for the currently logged in user
 * @param id The id of the job to take
 * @returns Exit code, 0 for success, 1 for job taken, 2 for job does not exist
 */
const takeJob = async (id: string): Promise<number> => {
	const job = await getJob(id);
	if (!job) return 1;
	if (job.employee) return 2;
	await updateDoc(doc(db, `jobs/${id}`), {
		employee: getCurrentUser().uid,
	});
	return 0;
};

const myFireBase = {
	auth: {
		createAccount,
		signIn,
		deleteAccount,
	},
	users: {
		getUser,
	},
	jobs: {
		createJob,
		deleteJob,
		getJobs,
		getJob,
		takeJob,
	},
};

export default myFireBase;
