export type TableResponse<T> = {
  page: number;
  pageSize: number;
  total: number;
  totalPage?: number;
  totalPages?: number;
  items: T[];
}
