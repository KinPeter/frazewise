import { Db } from 'mongodb';
import { ModuleNotFoundErrorResponse, OkResponse, UnknownErrorResponse } from './utils/response';
import { ApiModule } from './utils/constants';
import { serveAuth } from './modules/auth';
import { logRequest, parsePath } from './utils/request-utils';

export async function routeRequest(req: Request, db: Db): Promise<Response> {
  try {
    const { parsedUrl, moduleName } = parsePath(req);
    logRequest(req, parsedUrl);
    let response: Response;

    switch (moduleName) {
      case ApiModule.AUTH:
        response = await serveAuth(req, db);
        break;
      case ApiModule.SETTINGS:
      case ApiModule.DECKS:
      case ApiModule.CARDS:
      case '':
      case '/':
        response = new OkResponse('hello world');
        break;
      default:
        response = new ModuleNotFoundErrorResponse(moduleName);
        break;
    }

    return response;
  } catch (e) {
    console.error('[Router]', e);
    return new UnknownErrorResponse((e as any).message ?? e);
  }
}
