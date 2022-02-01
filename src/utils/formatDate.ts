/**
 * Formats a given date to a nice string,
 * following the norwegian standard format
 * @param date The date to format
 * @returns A formatted date string
 */
export default function formatDate(date: Date) {
	const day = makeTwoDigits(date.getDate());
	const month = makeTwoDigits(date.getMonth() + 1);
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}

const makeTwoDigits = (num: number): string => {
	const str = num.toString();
	return str.length === 1 ? '0' + str : str;
};
