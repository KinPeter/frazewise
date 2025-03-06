import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import { UUID } from '../../../common/types/misc';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { Card } from '../../../common/types/cards';
import { Deck } from '../../../common/types/decks';
import { DbCollection } from '../../utils/db-collections';

export async function deleteCard(req: Request, db: Db, user: User, id: UUID): Promise<Response> {
  try {
    if (req.method !== 'DELETE') return new MethodNotAllowedResponse(req.method);

    const cardCollection = db.collection<Card>(DbCollection.CARDS);
    const card = await cardCollection.findOne({ id, userId: user.id });
    if (!card) return new NotFoundErrorResponse('Card');

    const deckCollection = db.collection<Deck>(DbCollection.DECKS);
    const deck = await deckCollection.findOne({ id: card.deckId, userId: user.id });
    if (!deck) return new NotFoundErrorResponse('Deck');

    const result = await cardCollection.findOneAndDelete({ id, userId: user.id });
    if (!result) return new NotFoundErrorResponse('Card');

    await deckCollection.findOneAndUpdate(
      { id: deck.id, userId: user.id },
      { $set: { cardCount: deck.cardCount - 1, lastModified: new Date() } }
    );

    return new OkResponse({ id });
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
