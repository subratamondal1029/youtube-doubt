type ErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  data: null;
  errors: unknown[];
};

class ApiError extends Error {
  success: false;
  statusCode: number;
  message: string;
  data: null;
  errors: unknown[];
  track?: string;

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    errors: unknown[] = [],
    stack: string = ""
  ) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.errors = errors;

    if (stack) {
      this.track = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
      this.track = this.stack;
    }
  }

  getTrace() {
    return this.track;
  }

  toJSON(): ErrorResponse {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
    };
  }
}

export { ApiError };
export type { ErrorResponse };
