export interface IUser {
	employeeDescription: string;
	employerDescription: string;
	firstName: string;
	lastName: string;
	id: string;
}

export interface IFullJob {
	title: string;
	description: string;
	price: number;
	employee: IUser | null;
	employer: IUser;
	image: string;
	timeCreated: Date;
	timeJob: Date;
	id: string;
}

export interface JobRaw {
	employer: string;
	title: string;
	timeCreated: Time;
	employee: string;
	description: string;
	price: number;
	timeJob: Time;
	image: string;
	id: string;
}

interface Time {
	seconds: number;
	nanoseconds: number;
}

export interface ISimpleUser {
	employerDescription: string;
	lastName: string;
	employeeDescription: string;
	firstName: string;
}

export interface IUserParameter {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	employeeDescription?: string;
	employerDescription?: string;
}

export interface ISinginParams {
	email: string;
	password: string;
}

export interface ITimeStamp {
	seconds: number;
	nanoseconds: number;
}
