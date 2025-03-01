import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { AuthManager } from '../utils/auth-manager';
import { getParams, parsePath } from '../utils/request-utils';
import { getDecks } from './decks/get-decks';
import { getDeck } from './decks/get-deck';
import { updateDeck } from './decks/update-deck';
import { createDeck } from './decks/create-deck';
import { deleteDeck } from './decks/delete-deck';

const config: ModuleConfig = {
  pathOptions: ['/decks', '/decks/:id'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export async function serveDecks(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();
  const { pathname } = parsePath(req);
  const { id } = getParams(config.pathOptions, pathname);

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  switch (req.method) {
    case 'GET':
      if (!id) {
        return await getDecks(req, db, user);
      } else {
        return await getDeck(req, db, user, id);
      }
    case 'POST':
      return await createDeck(req, db, user);
    case 'PUT':
      return await updateDeck(req, db, user, id);
    case 'DELETE':
      return await deleteDeck(req, db, user, id);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
}
