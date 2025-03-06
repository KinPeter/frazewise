import { Db } from 'mongodb';
import * as yup from 'yup';
import { UUID } from '../../../common/types/misc';
import { User } from '../../../common/types/auth';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { ApiError, ValidationError } from '../../../common/enums/api-errors';
import { deckSchema } from '../../../common/validators/decks';
import { omitIdsForOne } from '../../utils/omit-ids';
import { DbCollection } from '../../utils/db-collections';
import { toDeckRequest } from '../../utils/request-mappers';
import { Deck } from '../../../common/types/decks';

export async function updateDeck(req: Request, db: Db, user: User, id: UUID): Promise<Response> {
  try {
    if (req.method !== 'PUT') return new MethodNotAllowedResponse(req.method);
    if (!id || !yup.string().uuid().isValidSync(id))
      return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const requestBody = await req.json();

    try {
      await deckSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Deck>(DbCollection.DECKS);
    const deck = await collection.findOne({ id, userId: user.id });
    if (!deck) return new NotFoundErrorResponse('Deck');

    const values = toDeckRequest(requestBody as Deck);

    if (deck.sourceLang !== values.sourceLang || deck.targetLang !== values.targetLang)
      return new ErrorResponse(ApiError.REQUEST_VALIDATION_FAILED, 400, {
        reason: ValidationError.LANGUAGE_MUST_NOT_CHANGE,
      });

    const result = await collection.findOneAndUpdate(
      { id, userId: user.id },
      { $set: { ...values, lastModified: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return new NotFoundErrorResponse('Deck');

    return new OkResponse(omitIdsForOne(result));
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
