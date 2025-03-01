import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import { MethodNotAllowedResponse, OkResponse, UnknownErrorResponse } from '../../utils/response';
import { DbCollection } from '../../utils/db-collections';
import { omitIds } from '../../utils/omit-ids';
import { Deck } from '../../../common/types/decks';

export async function getDecks(req: Request, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);
    const collection = db.collection<Deck>(DbCollection.DECKS);
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
