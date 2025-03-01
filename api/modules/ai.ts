import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownOperationErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { AuthManager } from '../utils/auth-manager';
import { getParams, parsePath } from '../utils/request-utils';
import { generateCards } from './ai/generate-cards';
import { GeminiManager } from '../utils/ai-manager';

const config: ModuleConfig = {
  pathOptions: ['/ai/:operation'],
  methods: ['POST', 'OPTIONS'],
};

export async function serveAi(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();
  const { pathname } = parsePath(req);
  const { operation } = getParams(config.pathOptions, pathname);

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  switch (operation) {
    case 'generate-cards':
      return await generateCards(req, new GeminiManager().init());
    default:
      return new UnknownOperationErrorResponse(operation);
  }
}
