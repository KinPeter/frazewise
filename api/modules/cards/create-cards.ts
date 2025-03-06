import { Db } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { User } from '../../../common/types/auth';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { Deck } from '../../../common/types/decks';
import { DbCollection } from '../../utils/db-collections';
import { bulkCardsSchema } from '../../../common/validators/cards';
import { BulkCardsRequest, Card } from '../../../common/types/cards';
import { ApiError, ValidationError } from '../../../common/enums/api-errors';
import { toBaseCardRequest } from '../../utils/request-mappers';
import { MAX_CARD_COUNT } from '../../../common/utils/constants';

export async function createCards(req: Request, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const requestBody = await req.json();

    try {
      await bulkCardsSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const { deckId, cards } = requestBody as BulkCardsRequest;
    const deckCollection = db.collection<Deck>(DbCollection.DECKS);
    const deck = await deckCollection.findOne({ id: deckId, userId: user.id });
    if (!deck) return new NotFoundErrorResponse('Deck');

    if (deck.cardCount + cards.length > MAX_CARD_COUNT)
      return new ErrorResponse(ApiError.REQUEST_VALIDATION_FAILED, 400, {
        reason: ValidationError.MAX_ITEM_COUNT,
      });

    if (
      cards.some(
        ({ sourceLang, targetLang }) =>
          sourceLang !== deck.sourceLang || targetLang !== deck.targetLang
      )
    )
      return new ErrorResponse(ApiError.REQUEST_VALIDATION_FAILED, 400, {
        reason: ValidationError.DECK_CARD_LANGUAGE_MISMATCH,
      });

    const cardCollection = db.collection<Card>(DbCollection.CARDS);
    const result = await cardCollection.insertMany(
      cards.map(values => ({
        id: uuid(),
        createdAt: new Date(),
        userId: user.id,
        ...toBaseCardRequest(values),
        deckId: deck.id,
        missCount: 0,
        successCount: 0,
        lastPracticed: null,
      }))
    );

    await deckCollection.findOneAndUpdate(
      { id: deckId, userId: user.id },
      { $set: { cardCount: deck.cardCount + cards.length, lastModified: new Date() } }
    );

    return new OkResponse({ created: result.insertedCount }, 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
