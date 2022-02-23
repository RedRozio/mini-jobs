import { State } from "./types";

export function reducer(state: State, index: number) {
  const item = state[index];
  if (!item.active) {
    if (item.type === "sort") {
      state = state.map((chip) =>
        chip.type === "sort"
          ? {
              ...chip,
              active: false,
            }
          : chip
      );
    }
    state[index].active = true;
  } else {
    if (item.type !== "sort") state[index].active = false;
  }
  return [...state];
}

export const initialState: State = [
  {
    label: "Title",
    value: "title",
    type: "sort",
  },
  {
    label: "Price",
    value: "price",
    type: "sort",
  },
  {
    label: "Job time",
    value: "jobTime",
    type: "sort",
  },
  {
    label: "Created time",
    value: "createdTime",
    type: "sort",
  },
  {
    label: "Taken",
    value: "taken",
    type: "filter",
  },
  {
    label: "Created by me",
    value: "created",
    type: "filter",
  },
  {
    label: "Available",
    value: "available",
    type: "filter",
  },
];
