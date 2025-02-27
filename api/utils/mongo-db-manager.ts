import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { getEnv } from './environment';

export class MongoDbManager {
  private client: MongoClient | null = null;

  public async getMongoDb(): Promise<{ client: MongoClient; db: Db }> {
    try {
      const [MONGO_DB_URI, MONGO_DB_NAME] = getEnv('MONGO_DB_URI', 'MONGO_DB_NAME');
      this.client = new MongoClient(MONGO_DB_URI ?? '', {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      const db = (await this.client.connect()).db(MONGO_DB_NAME);
      console.log('[MongoDbManager] Connected to the database:', db.databaseName);
      const init = await db.collection('init').findOne();
      console.log('[MongoDbManager] DB initialized:', init?.initialized);
      return { client: this.client, db };
    } catch (e) {
      throw new Error(`[MongoDbManager] Could not connect to the database: ${JSON.stringify(e)}`);
    }
  }

  public async closeMongoClient(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('[MongoDbManager] Closed connection to the database');
    }
  }
}
