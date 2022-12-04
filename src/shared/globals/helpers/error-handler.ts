import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string; // success, fail, error

  constructor(message: string) {
    super(message);
  }
  // NOTE: we use this because we don't want to get individual properties for each error when we call it's actually less code writing it this way and it's more readable and easier to understand what's going on nothing else
  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class FileToLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}
