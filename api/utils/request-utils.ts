import { IncomingMessage } from 'http';

export function stripPathname(pathname: string, baseRoute: string): string {
  if (!baseRoute) {
    return pathname;
  }
  if (pathname.startsWith(baseRoute)) {
    return pathname.slice(baseRoute.length);
  }
  return '';
}

export function convertRequest(req: IncomingMessage, body: string): Request {
  const { url, method } = req;
  const reqUrl = `https://${req.headers.host}${url}`;
  const headersInit: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    headersInit[key] = value as string;
  }
  const headers = new Headers(headersInit);

  let request: Request;

  if (body) {
    request = new Request(reqUrl, { method, headers, body });
  } else {
    request = new Request(reqUrl, { method, headers });
  }

  return request;
}
