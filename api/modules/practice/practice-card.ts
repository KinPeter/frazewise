import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { Deck } from '../../../common/types/decks';
import { DbCollection } from '../../utils/db-collections';
import { Card } from '../../../common/types/cards';
import { practiceSchema } from '../../../common/validators/practice';
import { PracticeRequest } from '../../../common/types/practice';

export async function practiceCard(req: Request, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'PATCH') return new MethodNotAllowedResponse(req.method);

    const requestBody = await req.json();

    try {
      await practiceSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const { cardId, isSuccess } = requestBody as PracticeRequest;
    const cardCollection = db.collection<Card>(DbCollection.CARDS);
    const card = await cardCollection.findOneAndUpdate(
      { id: cardId, userId: user.id },
      {
        $inc: isSuccess ? { successCount: 1 } : { missCount: 1 },
        $set: { lastPracticed: new Date() },
      },
      { returnDocument: 'after' }
    );
    if (!card) return new NotFoundErrorResponse('Card');

    const deckCollection = db.collection<Deck>(DbCollection.DECKS);
    const deck = await deckCollection.findOneAndUpdate(
      { id: card.deckId, userId: user.id },
      { $set: { lastPracticed: new Date() } }
    );
    if (!deck) return new NotFoundErrorResponse('Deck');

    return new OkResponse(card);
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
