export class HttpException extends Error {
  status: number
  message: string
  stack: string

  constructor(message: string, status: number, stack: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.stack = stack;
  }
}

export default HttpException
