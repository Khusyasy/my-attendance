// https://github.com/omniti-labs/jsend

type JSendSuccess<T> = {
  status: "success";
  data: T;
};

type JSendFail<T> = {
  status: "fail";
  data: T;
};

type JSendError = {
  status: "error";
  message: string;
};

type JSendErrorWithCode = JSendError & {
  code: number;
};

type JSendErrorWithData<T> = JSendError & {
  data: T;
};

type JSendErrorAll<T> = JSendError & {
  code: number;
  data: T;
};

const success = <T>(data: T): JSendSuccess<T> => ({
  status: "success",
  data,
});

const fail = <T>(data: T): JSendFail<T> => ({
  status: "fail",
  data,
});

function error(message: string): JSendError;
function error(message: string, code: number): JSendErrorWithCode;
function error<T>(message: string, data: T): JSendErrorWithData<T>;
function error<T>(message: string, code: number, data: T): JSendErrorAll<T>;
function error(message: string, code?: number, data?: unknown) {
  if (code !== undefined && data !== undefined) {
    return {
      status: "error",
      message,
      code,
      data,
    };
  } else if (code !== undefined) {
    return {
      status: "error",
      message,
      code,
    };
  } else if (data !== undefined) {
    return {
      status: "error",
      message,
      data,
    };
  } else {
    return {
      status: "error",
      message,
    };
  }
}

export default {
  success,
  fail,
  error,
};
