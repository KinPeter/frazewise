import { UUID } from '../../../common/types/misc';
import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { DbCollection } from '../../utils/db-collections';
import { omitIds, omitIdsForOne } from '../../utils/omit-ids';
import * as yup from 'yup';
import { ValidationError } from '../../../common/enums/api-errors';
import { Deck } from '../../../common/types/decks';
import { Card } from '../../../common/types/cards';

export async function getDeck(req: Request, db: Db, user: User, id: UUID): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);
    if (!id || !yup.string().uuid().isValidSync(id))
      return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const deckCollection = db.collection<Deck>(DbCollection.DECKS);
    const deck = await deckCollection.findOne({ id, userId: user.id });
    if (!deck) return new NotFoundErrorResponse('Deck');

    const cardCollection = db.collection<Card>(DbCollection.CARDS);
    const cursor = cardCollection.find({ deckId: id, userId: user.id });
    const cards = await cursor.toArray();

    const result = {
      ...(omitIdsForOne(deck) as Deck),
      cards: omitIds(cards),
    };

    return new OkResponse(result);
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
