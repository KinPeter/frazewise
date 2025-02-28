import { NotFoundErrorResponse, OkResponse, UnknownErrorResponse } from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { DbCollection } from '../../utils/db-collections';
import { Settings } from '../../../common/types/settings';
import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';

export async function getSettings(_req: Request, db: Db, user: User): Promise<Response> {
  try {
    const collection = db.collection<Settings>(DbCollection.SETTINGS);
    const settings = await collection.findOne({ userId: user.id });
    if (!settings) return new NotFoundErrorResponse('User settings');

    return new OkResponse(omitIdsForOne(settings));
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
