export type ApiResponse<T> = {
  data?: T;
  message: string;
  details?: unknown;
};
