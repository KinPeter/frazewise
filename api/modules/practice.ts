import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { AuthManager } from '../utils/auth-manager';
import { practiceCard } from './practice/practice-card';

const config: ModuleConfig = {
  pathOptions: ['/practice'],
  methods: ['PATCH', 'OPTIONS'],
};

export async function servePractice(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  switch (req.method) {
    case 'PATCH':
      return await practiceCard(req, db, user);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
}
