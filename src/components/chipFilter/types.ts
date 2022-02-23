import { JSXElementConstructor, ReactElement } from "react";

export type FilterType = "taken" | "available" | "created";
export type SortType =
  | "title"
  | "price"
  | "jobTime"
  | "createdTime"
  | undefined;

export type SortTypes = {
  sortType: SortType;
  filters: FilterType[];
};

export type State = (SortState | FilterState)[];

export type Icon = ReactElement<any, string | JSXElementConstructor<any>>;

export type SortState = {
  label: string;
  value: SortType;
  icon?: Icon;
  active?: boolean;
  type: "sort";
};

export type FilterState = {
  label: string;
  value: FilterType;
  icon?: Icon;
  active?: boolean;
  type: "filter";
};

export type OnSortOrFilterHandler = (
  sortType: SortType,
  filters: FilterType[]
) => void;
