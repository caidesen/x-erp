import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * 输入异常
 */
export class InputException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 业务异常
 */
export class BizException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
