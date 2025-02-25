import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  UnknownErrorResponse,
  UserNotFoundErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { AuthData, PasswordAuthRequest, User } from '../../../common/types/auth';
import { getAccessToken, validatePassword } from '../../utils/crypt-jwt';
import { DbCollection } from '../../utils/db-collections';
import { Db } from 'mongodb';
import { passwordAuthRequestSchema } from '../../../common/validators/auth';
import { ApiError } from '../../../common/enums/api-errors';

export async function passwordLogin(req: Request, db: Db): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as PasswordAuthRequest;

    try {
      await passwordAuthRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, password } = body;

    const users = db.collection<User>(DbCollection.USERS);
    const user = await users.findOne({ email });

    if (!user) return new UserNotFoundErrorResponse();

    const { id, passwordHash, passwordSalt, isPro } = user;
    if (!passwordHash || !passwordSalt) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_PASSWORD);
    }
    const isPasswordValid = await validatePassword(password, passwordHash, passwordSalt);
    if (!isPasswordValid) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_PASSWORD);
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse<AuthData>({ id, email, token, expiresAt, isPro });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  }
}
