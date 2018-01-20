export interface Page<T> {
  content: Array<T>;

  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;

  sort: Array<SortInfo>|null;

  first: boolean;
  last: boolean;
}

interface SortInfo {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
}

