import { Db } from 'mongodb';
import { ModuleNotFoundErrorResponse, UnknownErrorResponse } from './utils/response';
import { ApiModule } from './utils/constants';
import { logRequest, parsePath } from './utils/request-utils';
import { serveAuth } from './modules/auth';
import { serveSettings } from './modules/settings';
import { serveDecks } from './modules/decks';
import { serveCards } from './modules/cards';
import { servePractice } from './modules/practice';
import { serveAi } from './modules/ai';

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
        response = await serveSettings(req, db);
        break;
      case ApiModule.DECKS:
        response = await serveDecks(req, db);
        break;
      case ApiModule.CARDS:
        response = await serveCards(req, db);
        break;
      case ApiModule.PRACTICE:
        response = await servePractice(req, db);
        break;
      case ApiModule.AI:
        response = await serveAi(req, db);
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
