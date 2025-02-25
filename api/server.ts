import { IncomingMessage, ServerResponse, createServer } from 'http';
import 'dotenv/config';
import { getEnv } from './utils/environment';
import { LOGIN_CODE_REGEX } from '../common/utils/regex';

const hostname = '0.0.0.0';
const port = 5200;

const [SERVER_ROUTE] = getEnv('SERVER_ROUTE');

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const baseRoute = SERVER_ROUTE || '';

  if (req.method === 'GET' && (req.url === `${baseRoute}` || req.url === `${baseRoute}/`)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello from the API: ' + LOGIN_CODE_REGEX);
    return;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http(s)://${hostname}:${port}/`);
});
