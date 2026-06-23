import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string | object) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class DuplicateEmailException extends HttpException {
  constructor(email: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Email '${email}' already exists`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class CsvParsingException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `CSV parsing error: ${message}`,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
