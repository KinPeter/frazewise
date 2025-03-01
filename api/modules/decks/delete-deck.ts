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
} from '../../utils/response';
import { ValidationError } from '../../../common/enums/api-errors';
import { DbCollection } from '../../utils/db-collections';
import { Deck } from '../../../common/types/decks';

export async function deleteDeck(req: Request, db: Db, user: User, id: UUID): Promise<Response> {
  try {
    if (req.method !== 'DELETE') return new MethodNotAllowedResponse(req.method);
    if (!id || !yup.string().uuid().isValidSync(id))
      return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const collection = db.collection<Deck>(DbCollection.DECKS);

    const result = await collection.findOneAndDelete({ id, userId: user.id });
    if (!result) return new NotFoundErrorResponse('Deck');

    return new OkResponse({ id });
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
