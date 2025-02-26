import { ValidationError as YupValidationError } from 'yup';
import { ApiError } from '../../common/enums/api-errors';
import type { ValidationError } from '../../common/enums/api-errors';

export class OkResponse<T> extends Response {
  constructor(data: T, status = 200) {
    const payload = JSON.stringify(data);
    super(payload, { status });
    const returnedItems = Array.isArray(data) ? data.length : 1;
    console.log(
      `[Response] ${status} Status Success response generated ${returnedItems} item(s) in payload:`,
      `${payload.substring(0, 100)} ${payload.length > 100 ? '...' : ''}`
    );
  }
}

export class CorsOkResponse extends Response {
  constructor() {
    super('ok');
  }
}

export class ErrorResponse extends Response {
  constructor(message: string, status: number, details?: any) {
    super(JSON.stringify({ error: message, details }), { status });
    console.log(
      `[Response] ${status} Status Error response generated with message: ${message} ${details ? JSON.stringify(details) : ''}`
    );
  }
}

export class ValidationErrorResponse extends ErrorResponse {
  constructor(error: YupValidationError | ValidationError) {
    const payload = error instanceof YupValidationError ? error.errors : { reason: error };
    super(ApiError.REQUEST_VALIDATION_FAILED, 400, payload);
  }
}

export class UnauthorizedErrorResponse extends ErrorResponse {
  constructor(message?: string) {
    super(message ?? ApiError.UNAUTHORIZED, 401);
  }
}

export class NotFoundErrorResponse extends ErrorResponse {
  constructor(item: string) {
    super(ApiError.ITEM_NOT_FOUND, 404, { item });
  }
}

export class ModuleNotFoundErrorResponse extends ErrorResponse {
  constructor(module: string) {
    super(ApiError.MODULE_NOT_FOUND, 404, { module });
  }
}

export class UserNotFoundErrorResponse extends ErrorResponse {
  constructor() {
    super(ApiError.USER_NOT_FOUND, 404);
  }
}

export class MethodNotAllowedResponse extends ErrorResponse {
  constructor(method: string) {
    super(ApiError.METHOD_NOT_ALLOWED, 405, { method });
  }
}

export class UnauthorizedInvalidAccessTokenErrorResponse extends UnauthorizedErrorResponse {
  constructor() {
    super(ApiError.INVALID_AUTH_TOKEN);
  }
}

export class UnknownErrorResponse extends ErrorResponse {
  constructor(error: unknown) {
    super(ApiError.UNKNOWN_ERROR, 500, error);
    console.log('[Response]', JSON.stringify(error));
  }
}

export class UnknownOperationErrorResponse extends ErrorResponse {
  constructor(operation: string) {
    super(ApiError.UNKNOWN_OPERATION, 400, { operation });
  }
}

export class ForbiddenOperationErrorResponse extends ErrorResponse {
  constructor(operation?: string) {
    super(ApiError.FORBIDDEN_OPERATION, 403, operation ? { operation } : undefined);
  }
}

export class ConflictErrorResponse extends ErrorResponse {
  constructor(message?: string) {
    super(message ?? ApiError.CONFLICT, 409);
  }
}
