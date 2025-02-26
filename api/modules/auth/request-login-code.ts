import { createInitialSettings } from '../../utils/create-initial-data';
import { MailerManager } from '../../utils/mailer-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { v4 as uuid } from 'uuid';
import { getLoginCode } from '../../utils/crypt-jwt';
import { EmailRequest, User } from '../../../common/types/auth';
import { DbCollection } from '../../utils/db-collections';
import { emailRequestSchema } from '../../../common/validators/auth';
import { Db } from 'mongodb';

export async function requestLoginCode(
  req: Request,
  db: Db,
  emailManager: MailerManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as EmailRequest;

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email } = body;

    const users = db.collection<User>(DbCollection.USERS);
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      const createdAt = new Date();
      user = { id, email, createdAt, isPro: false };
      await users.insertOne({ id, email, createdAt, isPro: false });
      console.log('[Auth] Created new user:', email, id);
      await createInitialSettings(db, id);
      console.log('[Auth] Created initial settings data');
      emailManager.sendSignupNotification(email).then(); // no need to await this
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

    await emailManager.sendLoginCode(body.email, loginCode);
    return new OkResponse({ message: 'Check your inbox' });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  }
}
