import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { MongoDbManager } from './utils/mongo-db-manager';
import { convertRequest } from './utils/request-utils';
import { Db } from 'mongodb';
import { routeRequest } from './router';

const hostname = '0.0.0.0';
const port = 5200;
const dbManager = new MongoDbManager();

try {
  const { db } = await dbManager.getMongoDb();

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    await handleRequest(req, res, db);
  });

  server.listen(port, hostname, () => {
    console.log(`[server.ts] Server is running at http(s)://${hostname}:${port}/`);
  });
} catch (e) {
  console.error('[server.ts] Server crashed at', new Date(), 'reason:', e);
  await dbManager.closeMongoClient();
  throw e;
}

async function handleRequest(req: IncomingMessage, res: ServerResponse, db: Db): Promise<void> {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const request = convertRequest(req, body);
    const response = await routeRequest(request, db);
    const responseBody = await response.text();
    res.statusCode = response.status;
    res.end(responseBody);
  });
}

process.on('SIGINT', async () => {
  await dbManager.closeMongoClient();
  process.exit(1);
});

process.on('SIGTERM', async code => {
  await dbManager.closeMongoClient();
  process.exit(code);
});
