import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { getHashed } from '../../utils/crypt-jwt';
import { PasswordAuthRequest, User } from '../../../common/types/auth';
import { DbCollection } from '../../utils/db-collections';
import { Db } from 'mongodb';
import { passwordAuthRequestSchema } from '../../../common/validators/auth';
import { IdObject } from 'common/types/misc';

export async function setPassword(req: Request, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'PUT') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as PasswordAuthRequest;

    try {
      await passwordAuthRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, password } = body;

    const users = db.collection<User>(DbCollection.USERS);
    if (!user || user.email !== email) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const { hashedString: passwordHash, salt: passwordSalt } = getHashed(password);
    await users.updateOne(
      { id: user.id },
      {
        $set: {
          passwordHash,
          passwordSalt,
        },
      }
    );

    return new OkResponse<IdObject>({ id: user.id }, 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
