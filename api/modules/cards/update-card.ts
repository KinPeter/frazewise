import { Db } from 'mongodb';
import { User } from '../../../common/types/auth';
import { UUID } from '../../../common/types/misc';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { cardSchema } from '../../../common/validators/cards';
import { Card } from '../../../common/types/cards';
import { DbCollection } from '../../utils/db-collections';
import { ApiError, ValidationError } from '../../../common/enums/api-errors';
import { toUpdateCardRequest } from '../../utils/request-mappers';
import { omitIdsForOne } from '../../utils/omit-ids';

export async function updateCard(req: Request, db: Db, user: User, id: UUID): Promise<Response> {
  try {
    if (req.method !== 'PUT') return new MethodNotAllowedResponse(req.method);

    const requestBody = await req.json();

    try {
      await cardSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const values = toUpdateCardRequest(requestBody as Card);
    const cardCollection = db.collection<Card>(DbCollection.CARDS);
    const card = await cardCollection.findOne({ id, deckId: values.deckId, userId: user.id });
    if (!card) return new NotFoundErrorResponse('Card');

    if (card.sourceLang !== values.sourceLang || card.targetLang !== values.targetLang)
      return new ErrorResponse(ApiError.REQUEST_VALIDATION_FAILED, 400, {
        reason: ValidationError.LANGUAGE_MUST_NOT_CHANGE,
      });

    const result = await cardCollection.findOneAndUpdate(
      { id, deckId: values.deckId, userId: user.id },
      { $set: { ...values } },
      { returnDocument: 'after' }
    );
    if (!result) return new NotFoundErrorResponse('Card');

    return new OkResponse(omitIdsForOne(result));
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
