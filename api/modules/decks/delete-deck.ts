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

    const deckCollection = db.collection<Deck>(DbCollection.DECKS);

    const result = await deckCollection.findOneAndDelete({ id, userId: user.id });
    if (!result) return new NotFoundErrorResponse('Deck');

    const cardsCollection = db.collection(DbCollection.CARDS);
    await cardsCollection.deleteMany({ deckId: id, userId: user.id });

    return new OkResponse({ id });
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
