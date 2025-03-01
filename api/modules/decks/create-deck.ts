import { Db } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { User } from '../../../common/types/auth';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { deckSchema } from '../../../common/validators/decks';
import { DbCollection } from '../../utils/db-collections';
import { toDeckRequest } from '../../utils/request-mappers';
import { Deck } from '../../../common/types/decks';
import { omitIdsForOne } from '../../utils/omit-ids';

export async function createDeck(req: Request, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const requestBody = await req.json();

    try {
      await deckSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Deck>(DbCollection.DECKS);

    const newItem: Deck = {
      id: uuid(),
      createdAt: new Date(),
      userId: user.id,
      ...toDeckRequest(requestBody as Deck),
      cardCount: 0,
      lastPracticed: null,
    };

    await collection.insertOne(newItem);

    return new OkResponse(omitIdsForOne(newItem), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
