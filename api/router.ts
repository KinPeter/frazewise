import { Db } from 'mongodb';
import { parse } from 'url';
import { stripPathname } from './utils/request-utils';
import { getEnv } from './utils/environment';
import { OkResponse, UnknownOperationErrorResponse } from './utils/response';

export async function routeRequest(req: Request, db: Db): Promise<Response> {
  const [SERVER_ROUTE] = getEnv('SERVER_ROUTE');
  const baseRoute = SERVER_ROUTE || '';
  const { method, url } = req;
  const parsedUrl = parse(url || '', true);
  const pathname = stripPathname(parsedUrl.pathname ?? '', baseRoute);
  let response: Response;
  console.log(
    '\n[Router] Request:',
    method,
    parsedUrl.pathname,
    Object.keys(parsedUrl.query).length ? JSON.stringify(parsedUrl.query) : ''
  );

  console.log({ pathname });
  switch (pathname) {
    case '':
    case '/':
      response = new OkResponse('hello world');
      break;
    default:
      response = new UnknownOperationErrorResponse(pathname);
      break;
  }

  // console.log(
  //   '[Router] Response:',
  //   response.status,
  //   responseBody.substring(0, 100),
  //   responseBody.length > 100 ? '...' : ''
  // );

  return response;
}
