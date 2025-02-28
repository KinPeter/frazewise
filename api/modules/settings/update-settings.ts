import {
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import { Settings, SettingsRequest } from '../../../common/types/settings';
import { settingsSchema } from '../../../common/validators/settings';
import { DbCollection } from '../../utils/db-collections';
import { toSettingsRequest } from '../../utils/request-mappers';

export async function updateSettings(req: Request, db: Db, user: User): Promise<Response> {
  try {
    const requestBody = (await req.json()) as SettingsRequest;

    try {
      await settingsSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const doc: Partial<Settings> = toSettingsRequest(requestBody);
    const collection = db.collection<Settings>(DbCollection.SETTINGS);
    const settings = await collection.findOneAndUpdate(
      { userId: user.id },
      { $set: { ...doc } },
      { returnDocument: 'after' }
    );
    if (!settings) return new NotFoundErrorResponse('User settings');

    return new OkResponse(omitIdsForOne(settings));
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
