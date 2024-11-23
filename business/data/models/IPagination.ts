interface IPagination<T> {
  currentPage: number;
  lastPage: number;
  totalItems: number;
  data: T[];
}

export const initialPagination = <T>(): IPagination<T> => ({
  currentPage: 1,
  lastPage: 1,
  totalItems: 0,
  data: [],
});

export default IPagination;
