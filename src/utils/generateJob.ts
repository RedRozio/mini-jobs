import myFireBase from "./myFireBase";

const jobTitles = [
  "Delivery driver",
  "Personal assistant",
  "Household help wanted",
  "Need someone to wash my home",
  "Caregiver wanted",
  "Pet sitter wanted",
  "Need someone to walk my dog",
  "Customer service representative",
  "Micro jobs",
  "Focus group research study host wanted",
  "Organizer for parties wanted",
  "Restaurant waiter wanted",
  "Need someone to paint my home",
  "Tutoring wanted",
];

const userUids = [
  "5AxB2uDvj9VxuiZE2UQPzpglbL12",
  "vfwaCNyy2Ub48l46dLI1xxIdCCx1",
  "YfDT4ydtCPW6Sz4yNp6e8yo0EKF3",
  "NMnafKbzKwUwD4cWCa3MzfjoGMZ2",
  "3aYH6UW52XOzXHHWzYy8WrlhoXD3",
  "wKSyuXXEebSmqAtJ9T5d9zwwlNE3",
  "GSTEL6pMkeYHvKQ9Lpqu2FaWgEC2",
];

// const randomImageUrl = 'https://picsum.photos/300/200?random=2';

const imageUrls = [
  "https://i.picsum.photos/id/321/300/200.jpg?hmac=3lgt59sxk07yeucaVsJUET41CJ-pdkXnIGvMkzK2jEk",
  "https://i.picsum.photos/id/885/300/200.jpg?hmac=uv1toUJrLgqhkJZrhDYMg-7ea04zqkwax5WZVw-7zbg",
  "https://i.picsum.photos/id/502/300/200.jpg?hmac=7N0uLOwSllkH6v566juijFwftj6Xi4JqlChntFFZgAc",
  "https://i.picsum.photos/id/413/300/200.jpg?hmac=OW7eSq7sU4kr3VddQYmAbhUZ8c9R3Utixj2Q9IwDXSU",
  "https://i.picsum.photos/id/220/300/200.jpg?hmac=hSpCnndQS-mcDCoNofXR1qu9UvK-W1OnP6212H6w8Ds",
  "https://i.picsum.photos/id/716/300/200.jpg?hmac=iSJZ9JwX-2djF6nzk4tByUgKCPYngXLpSc4_jFUiB30",
  "https://i.picsum.photos/id/736/300/200.jpg?hmac=VMEBbfgnuOtJXS_RYVlSfGKd37uTDHtHcqWbvaXnBI8",
  "https://i.picsum.photos/id/364/300/200.jpg?hmac=GH5eF3UfY_bGIWeyUm_RCs9RgVMjax-MCmtoRgQ7xlA",
];

const getRandomValue = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export default function generateJob() {
  myFireBase.jobs.createJob({
    title: getRandomValue(jobTitles),
    description: getRandomValue(jobTitles) + getRandomValue(jobTitles),
    image: getRandomValue(imageUrls),
    price: Math.floor(Math.random() * 1000),
    timeJob: new Date(),
  });
}
