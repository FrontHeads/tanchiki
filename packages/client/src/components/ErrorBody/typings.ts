export type ErrorType = {
  status?: number;
  statusText?: string;
  message?: string;
};

export type ErrorBodyProps = {
  status?: string;
  message?: string;
  isRefresh?: boolean;
};
