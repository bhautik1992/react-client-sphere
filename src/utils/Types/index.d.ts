// Can vary depending on your BE response
export interface IApiSuccess<T> {
  data: T;
  message?: number;
}
export interface IApiError {
  message: string;
  status: number;
}
