import {
  ForbiddenOperationErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { v4 as uuid } from 'uuid';
import { getLoginCode } from '../../utils/crypt-jwt';
import { getEnv } from '../../utils/environment';
import { EmailRequest, User } from '../../../common/types/auth';
import { DbCollection } from '../../utils/db-collections';
import { emailRequestSchema } from '../../../common/validators/auth';
import { Db } from 'mongodb';
import { createInitialSettings } from '../../utils/create-initial-data';

export async function instantLoginCode(req: Request, db: Db): Promise<Response> {
  try {
    const [PK_ENV] = getEnv('PK_ENV');
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);
    if (PK_ENV !== 'dev') return new ForbiddenOperationErrorResponse();

    const body = (await req.json()) as EmailRequest;

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email } = body;
    console.warn(`[Auth][DEV] ${email} is getting instant login code on '${PK_ENV}' env`);

    const users = db.collection<User>(DbCollection.USERS);
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      user = { id, email, createdAt: new Date(), isPro: false };
      await users.insertOne(user);
      console.log('[Auth] Created new user:', email, id);
      await createInitialSettings(db, id);
      console.log('[Auth] Created initial settings data');
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt } = await getLoginCode();
    await users.updateOne(
      { id: user.id },
      {
        $set: {
          loginCode: hashedLoginCode,
          loginCodeExpires,
          salt,
        },
      }
    );

    return new OkResponse({ loginCode });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  }
}
