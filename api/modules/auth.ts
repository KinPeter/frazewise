import { Db } from 'mongodb';
import {
  CorsOkResponse,
  MethodNotAllowedResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownOperationErrorResponse,
} from '../utils/response';
import { ModuleConfig } from '../utils/types';
import { getParams, parsePath } from '../utils/request-utils';
import { requestLoginCode } from './auth/request-login-code';
import { HttpClient } from '../utils/http-client';
import { MailerManager } from '../utils/mailer-manager';
import { verifyLoginCode } from './auth/verify-login-code';
import { passwordLogin } from './auth/password-login';
import { instantLoginCode } from './auth/instant-login-code';
import { refreshToken } from './auth/refresh-token';
import { setPassword } from './auth/set-password';
import { AuthManager } from '../utils/auth-manager';

const config: ModuleConfig = {
  pathOptions: ['/auth/:operation'],
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export async function serveAuth(req: Request, db: Db): Promise<Response> {
  if (!config.methods.includes(req.method)) return new MethodNotAllowedResponse(req.method);
  if (req.method === 'OPTIONS') return new CorsOkResponse();
  const { pathname } = parsePath(req);
  const { operation } = getParams(config.pathOptions, pathname);

  const httpClient = new HttpClient(fetch);
  const emailManager = new MailerManager(httpClient);

  // PUBLIC routes
  switch (operation) {
    case 'login':
      return await requestLoginCode(req, db, emailManager);
    case 'verify-code':
      return await verifyLoginCode(req, db);
    case 'password-login':
      return await passwordLogin(req, db);
    case 'instant-login-code':
      // FOR TESTING PURPOSES ONLY! WORKS ON DEV ENV ONLY!
      return await instantLoginCode(req, db);
  }

  const user = await new AuthManager().authenticateUser(req, db);
  if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

  // AUTHENTICATED routes
  switch (operation) {
    case 'token-refresh':
      return await refreshToken(req, user);
    case 'set-password':
      return await setPassword(req, db, user);
    default:
      return new UnknownOperationErrorResponse(`/auth/${operation}`);
  }
}
