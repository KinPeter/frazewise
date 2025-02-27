import { Db } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { Settings } from '../../common/types/settings';
import { DbCollection } from './db-collections';

export async function createInitialSettings(db: Db, userId: string): Promise<void> {
  const collection = db.collection<Settings>(DbCollection.SETTINGS);
  await collection.insertOne({
    id: uuid(),
    createdAt: new Date(),
    userId,
    name: null,
    language: 'en',
    profilePicUrl: null,
  });
}
