import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  UnknownErrorResponse,
  UserNotFoundErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { getAccessToken, validateLoginCode } from '../../utils/crypt-jwt';
import { AuthData, LoginVerifyRequest, User } from '../../../common/types/auth';
import { DbCollection } from '../../utils/db-collections';
import { loginVerifyRequestSchema } from '../../../common/validators/auth';
import { ApiError } from '../../../common/enums/api-errors';
import { Db } from 'mongodb';

export async function verifyLoginCode(req: Request, db: Db): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as LoginVerifyRequest;

    try {
      await loginVerifyRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, loginCode } = body;

    const users = db.collection<User>(DbCollection.USERS);
    const user = await users.findOne({ email });
    if (!user) return new UserNotFoundErrorResponse();

    const { id, loginCodeExpires, loginCode: hashedLoginCode, salt, isPro } = user;
    if (!hashedLoginCode || !salt || !loginCodeExpires) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_LOGIN_CODE);
    }
    const loginCodeValidity = await validateLoginCode(
      loginCode,
      salt,
      hashedLoginCode,
      loginCodeExpires
    );
    if (loginCodeValidity !== 'valid') {
      return new UnauthorizedErrorResponse(
        loginCodeValidity === 'invalid' ? ApiError.INVALID_LOGIN_CODE : ApiError.EXPIRED_LOGIN_CODE
      );
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse<AuthData>({ id, email, token, expiresAt, isPro });
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
