type SuccessResponse = {
  success: true;
  statusCode: number;
  message: string;
  data: Record<string, unknown>;
};

class ApiSuccess<T = Record<string, unknown>> {
  success: true;
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number = 200, message: string = "Success", data: T = {} as T) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  toJson(): SuccessResponse {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data as Record<string, unknown>,
    };
  }
}

export type { SuccessResponse };
export { ApiSuccess };
