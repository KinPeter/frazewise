import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { AuthManager } from '../utils/auth-manager';
import { getSettings } from './settings/get-settings';
import { updateSettings } from './settings/update-settings';

const config: ModuleConfig = {
  pathOptions: ['/settings'],
  methods: ['GET', 'PUT', 'OPTIONS'],
};

export async function serveSettings(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  switch (req.method) {
    case 'GET':
      return await getSettings(req, db, user);
    case 'PUT':
      return await updateSettings(req, db, user);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
}
