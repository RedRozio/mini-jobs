import { initializeApp } from "firebase/app";
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
  QueryConstraint,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Unsubscribe,
  signOut as signOutAuth,
} from "firebase/auth";
import {
  ISimpleUser,
  IUser,
  IFullJob,
  IUserParameter,
  ISinginParams as ISigninParams,
  ITimeStamp,
  IJobDocData,
} from "./types";
import firebaseConfig from "../constants/firebaseConfig";
import { SortTypes } from "../components/chipFilter/types";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getUserDocRef = (id: string) => doc(db, `users/${id}`);

const getCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not currently signed in");
  return user;
};

const timestampToDate = ({ seconds, nanoseconds }: ITimeStamp) =>
  new Timestamp(seconds, nanoseconds).toDate();

const jobsQuery = query(collection(db, "jobs"), orderBy("title"));

/**
 * Listens to auth changes, and takes a listener to send the user object
 * @param listener Function that accepts the user to do something
 * @returns The unsubscribe function to stop listening
 */
const listenForAuthChanges = (
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

/**
 * Listens for CRUD changes in the jobs collection
 * @param listener Function that is called when job collection changes
 * @returns Unsubscribe function to stop listening
 */
const listenForJobChanges = (listener: (jobs: IFullJob[]) => void) => {
  const unsubscribe = onSnapshot(jobsQuery, ({ docs }) => {
    const promises: Promise<IFullJob>[] = [];
    for (let i = 0; i < docs.length; i++) {
      promises.push(getJob(docs[i].id) as Promise<IFullJob>);
    }
    Promise.all(promises).then(listener);
  });
  return unsubscribe;
};

/**
 * Authenticates a user with email and password, and saves data on the users collection
 * @param user User information to use for authentication and document
 * @returns A user object containing information from the users collection
 */
const createAccount = async (user: IUserParameter): Promise<IUser> => {
  const {
    email,
    password,
    firstName,
    lastName,
    employeeDescription: erDesc,
    employerDescription: eeDesk,
  } = user;

  const {
    user: { uid },
  } = await createUserWithEmailAndPassword(auth, email, password);

  const userDoc = {
    firstName,
    lastName,
    employeeDescription: erDesc ?? "",
    employerDescription: eeDesk ?? "",
  };

  // Creates document with user UID as the ID
  await setDoc(getUserDocRef(uid), userDoc);
  return { ...userDoc, id: uid };
};

/**
 * Signs in a user with the given parameters
 * @param email Email to use
 * @param password Password to use
 * @returns User object with UID
 */
const signIn = async ({ email, password }: ISigninParams): Promise<IUser> => {
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
 */
const deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not currently signed in");
  await deleteDoc(getUserDocRef(user.uid));
  // Delete all job posts from user, and all taken jobs
  const jobs = await getJobs();
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    if (job.employee?.id === user.uid) {
      await untakeJob(job.id);
    } else if (job.employer.id === user.uid) {
      await deleteJob(job.id);
    }
  }
  await user.delete();
};

const signOut = async () => {
  signOutAuth(auth);
};

const getUser = async (id: string): Promise<ISimpleUser> => {
  const userDoc = await getDoc(doc(db, `users/${id}`));
  return userDoc.data() as ISimpleUser;
};

const getUserWithId = async (id: string): Promise<IUser | null> => {
  if (!id.length) return null;
  const userDoc = await getUser(id);
  return { ...userDoc, id };
};

const editUser = async (values: ISimpleUser) => {
  const user = getCurrentUser();
  await updateDoc(getUserDocRef(user.uid), values as any);
};

interface JobParameter {
  title: string;
  description: string;
  image: string;
  price: number;
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
    timeCreated: Timestamp.fromDate(new Date()),
    employee: "",
    employer: getCurrentUser().uid,
    timeJob: Timestamp.fromDate(job.timeJob),
  };
  const jobDoc = await addDoc(collection(db, "jobs"), jobObject);
  return jobDoc.id;
};

/**
 * Deletes a given job
 * @param id The id of the job to delete
 */
const deleteJob = async (id: string) => {
  await deleteDoc(doc(db, `jobs/${id}`));
};

const queryJobs = async ({
  filters,
  sortType,
}: SortTypes): Promise<IFullJob[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return getJobs();
  const queryConstraints: QueryConstraint[] = [];
  filters.forEach((filter) => {
    switch (filter) {
      case "available":
        queryConstraints.push(where("employee", "==", ""));
        break;
      case "created":
        queryConstraints.push(where("employer", "==", userId));
        break;
      case "taken":
        queryConstraints.push(where("employee", "==", userId));
        break;
    }
  });

  if (sortType) queryConstraints.push(orderBy(sortType));

  return getJobs(...queryConstraints);
};

/**
 * Fetches all jobs in the database
 * @returns Array of job objects
 */
const getJobs = async (
  ...queryConstraints: QueryConstraint[]
): Promise<IFullJob[]> => {
  console.log(queryConstraints);

  const constraints = [...queryConstraints];
  const _query = query(collection(db, "jobs"), ...constraints);
  const docs = (await getDocs(_query)).docs;
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
  const jobDocData = jobDoc.data() as IJobDocData;
  const {
    employee: employeeId,
    employer: employerId,
    timeCreated,
    timeJob,
  } = jobDocData;

  const employee = await getUserWithId(employeeId);
  const employer = (await getUserWithId(employerId)) as unknown as IUser;

  const fullJobDocData: IFullJob = {
    ...jobDocData,
    id: jobDoc.id,
    employer,
    employee,
    timeCreated: timestampToDate(timeCreated),
    timeJob: timestampToDate(timeJob),
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

const untakeJob = async (id: string): Promise<number> => {
  const job = await getJob(id);
  if (!job) return 1;
  if (job.employee?.id === getCurrentUser().uid) {
    await updateDoc(doc(db, `jobs/${id}`), {
      employee: "",
    });
    return 0;
  }
  return 2;
};

const myFireBase = {
  auth: {
    createAccount,
    signIn,
    deleteAccount,
    signOut,
    getCurrentUser,
  },
  users: {
    getUser,
    editUser,
  },
  jobs: {
    createJob,
    deleteJob,
    getJobs,
    queryJobs,
    getJob,
    takeJob,
    untakeJob,
  },
  listeners: {
    listenForAuthChanges,
    listenForJobChanges,
  },
};

export default myFireBase;
