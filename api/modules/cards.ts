import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { AuthManager } from '../utils/auth-manager';
import { getParams, parsePath } from '../utils/request-utils';
import { createCards } from './cards/create-cards';
import { updateCard } from './cards/update-card';
import { deleteCard } from './cards/delete-card';

const config: ModuleConfig = {
  pathOptions: ['/cards', '/cards/:id'],
  methods: ['POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export async function serveCards(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();
  const { pathname } = parsePath(req);
  const { id } = getParams(config.pathOptions, pathname);

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  switch (req.method) {
    case 'POST':
      return await createCards(req, db, user);
    case 'PUT':
      return await updateCard(req, db, user, id);
    case 'DELETE':
      return await deleteCard(req, db, user, id);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
}
