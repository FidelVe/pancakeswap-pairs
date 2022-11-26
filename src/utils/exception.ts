// src/utils/exception.ts
//
/*
 * Custom exception
 */
class Exception {
  message: string;
  newError: any;

  constructor(errObj: object, prevErrorMessage: string) {
    this.message = prevErrorMessage;
    this.newError = errObj;
  }

  toString() {
    return `${this.message}.\n${this.newError.message}`;
  }
}

export = Exception;
